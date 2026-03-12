use {regex::Regex, serde_json::Value};

use crate::{
    error::{Result, SymphonyError},
    models::Issue,
};

pub fn render_prompt(template: &str, issue: &Issue, attempt: Option<u32>) -> Result<String> {
    if template.trim().is_empty() {
        return Ok("You are working on an issue from Linear.".to_string());
    }

    if template.contains("{%") {
        return Err(SymphonyError::TemplateParseError {
            message: "block tags are not supported in this implementation slice".to_string(),
        });
    }

    let token_re = Regex::new(r"\{\{\s*([^}]+?)\s*\}\}").map_err(|error| {
        SymphonyError::TemplateParseError {
            message: error.to_string(),
        }
    })?;

    let mut context = serde_json::Map::new();
    context.insert("issue".to_string(), serde_json::to_value(issue)?);
    context.insert(
        "attempt".to_string(),
        attempt.map_or(Value::Null, |value| Value::Number(value.into())),
    );

    let root = Value::Object(context);
    let mut rendered = String::new();
    let mut last_index = 0;

    for captures in token_re.captures_iter(template) {
        let Some(full) = captures.get(0) else {
            return Err(SymphonyError::TemplateParseError {
                message: "missing full template capture".to_string(),
            });
        };
        rendered.push_str(&template[last_index..full.start()]);
        let expression = captures
            .get(1)
            .map(|value| value.as_str().trim())
            .unwrap_or_default();
        if expression.contains('|') {
            return Err(SymphonyError::TemplateParseError {
                message: format!("filters are not supported: `{expression}`"),
            });
        }
        let value = lookup_value(&root, expression)?;
        rendered.push_str(&render_value(value));
        last_index = full.end();
    }

    rendered.push_str(&template[last_index..]);
    Ok(rendered)
}

fn lookup_value<'a>(root: &'a Value, expression: &str) -> Result<&'a Value> {
    let mut current = root;
    for segment in expression.split('.') {
        let trimmed = segment.trim();
        if trimmed.is_empty() {
            return Err(SymphonyError::TemplateParseError {
                message: format!("invalid empty path segment in `{expression}`"),
            });
        }

        current = match current {
            Value::Object(map) => {
                map.get(trimmed)
                    .ok_or_else(|| SymphonyError::TemplateRenderError {
                        message: format!("unknown variable `{expression}`"),
                    })?
            },
            _ => {
                return Err(SymphonyError::TemplateRenderError {
                    message: format!("unknown variable `{expression}`"),
                });
            },
        };
    }
    Ok(current)
}

fn render_value(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::Bool(inner) => inner.to_string(),
        Value::Number(inner) => inner.to_string(),
        Value::String(inner) => inner.clone(),
        Value::Array(_) | Value::Object(_) => serde_json::to_string(value).unwrap_or_default(),
    }
}

#[cfg(test)]
#[allow(clippy::expect_used, clippy::unwrap_used)]
mod tests {
    use {super::*, crate::models::BlockerRef, time::OffsetDateTime};

    fn sample_issue() -> Issue {
        Issue {
            id: "1".to_string(),
            identifier: "MT-1".to_string(),
            title: "Implement feature".to_string(),
            description: Some("Details".to_string()),
            priority: Some(1),
            state: "Todo".to_string(),
            branch_name: None,
            url: None,
            labels: vec!["backend".to_string()],
            blocked_by: vec![BlockerRef {
                id: Some("2".to_string()),
                identifier: Some("MT-2".to_string()),
                state: Some("Done".to_string()),
            }],
            created_at: Some(OffsetDateTime::UNIX_EPOCH),
            updated_at: None,
        }
    }

    #[test]
    fn renders_supported_placeholders() {
        let output = render_prompt(
            "Issue {{ issue.identifier }} / {{ issue.title }} / {{ attempt }}",
            &sample_issue(),
            Some(2),
        )
        .unwrap();
        assert_eq!(output, "Issue MT-1 / Implement feature / 2");
    }

    #[test]
    fn rejects_unknown_variables() {
        let err = render_prompt("{{ issue.nope }}", &sample_issue(), None).unwrap_err();
        assert!(matches!(err, SymphonyError::TemplateRenderError { .. }));
    }

    #[test]
    fn rejects_filters_for_now() {
        let err = render_prompt("{{ issue.title | upcase }}", &sample_issue(), None).unwrap_err();
        assert!(matches!(err, SymphonyError::TemplateParseError { .. }));
    }
}
