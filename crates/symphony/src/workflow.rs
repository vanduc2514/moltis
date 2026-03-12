use std::{
    collections::BTreeMap,
    path::{Path, PathBuf},
};

use serde_json::Value;

use crate::{
    error::{Result, SymphonyError},
    models::WorkflowDefinition,
};

#[must_use]
pub fn resolve_workflow_path(explicit: Option<&Path>) -> PathBuf {
    explicit.map(Path::to_path_buf).unwrap_or_else(|| {
        std::env::current_dir()
            .unwrap_or_else(|_| PathBuf::from("."))
            .join("WORKFLOW.md")
    })
}

pub fn load_workflow(path: &Path) -> Result<WorkflowDefinition> {
    if !path.exists() {
        return Err(SymphonyError::MissingWorkflowFile {
            path: path.to_path_buf(),
        });
    }

    let raw = std::fs::read_to_string(path)?;
    let (config, prompt_template) = parse_workflow_document(&raw)?;

    Ok(WorkflowDefinition {
        path: path.to_path_buf(),
        config,
        prompt_template,
    })
}

pub fn parse_workflow_document(raw: &str) -> Result<(BTreeMap<String, Value>, String)> {
    let trimmed = raw.trim_start_matches('\u{feff}');
    if !trimmed.starts_with("---") {
        return Ok((BTreeMap::new(), trimmed.trim().to_string()));
    }

    let mut lines = trimmed.lines();
    let first = lines.next().unwrap_or_default().trim_end_matches('\r');
    if first != "---" {
        return Ok((BTreeMap::new(), trimmed.trim().to_string()));
    }

    let mut yaml_lines = Vec::new();
    let mut body_lines = Vec::new();
    let mut in_front_matter = true;

    for line in lines {
        let normalized = line.trim_end_matches('\r');
        if in_front_matter && normalized == "---" {
            in_front_matter = false;
            continue;
        }

        if in_front_matter {
            yaml_lines.push(line);
        } else {
            body_lines.push(line);
        }
    }

    if in_front_matter {
        return Err(SymphonyError::WorkflowParseError {
            message: "unclosed YAML front matter".to_string(),
        });
    }

    let yaml = yaml_lines.join("\n");
    let yaml_value: serde_yaml::Value = serde_yaml::from_str(&yaml)?;
    let json_value = serde_json::to_value(yaml_value)?;
    let Value::Object(map) = json_value else {
        return Err(SymphonyError::WorkflowFrontMatterNotAMap);
    };

    let config = map.into_iter().collect::<BTreeMap<_, _>>();
    let prompt_template = body_lines.join("\n").trim().to_string();
    Ok((config, prompt_template))
}

#[cfg(test)]
#[allow(clippy::expect_used, clippy::unwrap_used)]
mod tests {
    use super::*;

    #[test]
    fn parses_workflow_without_front_matter() {
        let (config, prompt) = parse_workflow_document("Hello {{ issue.title }}").unwrap();
        assert!(config.is_empty());
        assert_eq!(prompt, "Hello {{ issue.title }}");
    }

    #[test]
    fn parses_front_matter_and_trims_prompt() {
        let raw = "---\npolling:\n  interval_ms: 1500\n---\n\nHi\n";
        let (config, prompt) = parse_workflow_document(raw).unwrap();
        assert_eq!(config["polling"]["interval_ms"], 1500);
        assert_eq!(prompt, "Hi");
    }

    #[test]
    fn rejects_non_map_front_matter() {
        let err = parse_workflow_document("---\n- one\n- two\n---\nhello").unwrap_err();
        assert!(matches!(err, SymphonyError::WorkflowFrontMatterNotAMap));
    }
}
