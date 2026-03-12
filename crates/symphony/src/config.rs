use std::{
    collections::{HashMap, HashSet},
    path::{Path, PathBuf},
};

use {
    secrecy::{ExposeSecret, Secret},
    serde_json::Value,
};

use crate::{
    error::{Result, SymphonyError},
    models::WorkflowDefinition,
};

const DEFAULT_LINEAR_ENDPOINT: &str = "https://api.linear.app/graphql";
const DEFAULT_POLL_INTERVAL_MS: u64 = 30_000;
const DEFAULT_HOOK_TIMEOUT_MS: u64 = 60_000;
const DEFAULT_MAX_CONCURRENT_AGENTS: u32 = 10;
const DEFAULT_MAX_TURNS: u32 = 20;
const DEFAULT_MAX_RETRY_BACKOFF_MS: u64 = 300_000;
const DEFAULT_CODEX_COMMAND: &str = "codex app-server";
const DEFAULT_TURN_TIMEOUT_MS: u64 = 3_600_000;
const DEFAULT_READ_TIMEOUT_MS: u64 = 5_000;
const DEFAULT_STALL_TIMEOUT_MS: i64 = 300_000;

#[derive(Debug, Clone)]
pub struct TrackerConfig {
    pub kind: String,
    pub endpoint: String,
    pub api_key: Option<Secret<String>>,
    pub project_slug: Option<String>,
    pub active_states: Vec<String>,
    pub terminal_states: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PollingConfig {
    pub interval_ms: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WorkspaceConfig {
    pub root: PathBuf,
}

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct HooksConfig {
    pub after_create: Option<String>,
    pub before_run: Option<String>,
    pub after_run: Option<String>,
    pub before_remove: Option<String>,
    pub timeout_ms: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AgentConfig {
    pub max_concurrent_agents: u32,
    pub max_turns: u32,
    pub max_retry_backoff_ms: u64,
    pub max_concurrent_agents_by_state: HashMap<String, u32>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct CodexConfig {
    pub command: String,
    pub approval_policy: Option<String>,
    pub thread_sandbox: Option<String>,
    pub turn_sandbox_policy: Option<Value>,
    pub turn_timeout_ms: u64,
    pub read_timeout_ms: u64,
    pub stall_timeout_ms: i64,
}

#[derive(Debug, Clone)]
pub struct ServiceConfig {
    pub workflow_path: PathBuf,
    pub tracker: TrackerConfig,
    pub polling: PollingConfig,
    pub workspace: WorkspaceConfig,
    pub hooks: HooksConfig,
    pub agent: AgentConfig,
    pub codex: CodexConfig,
}

impl ServiceConfig {
    pub fn from_workflow(definition: &WorkflowDefinition) -> Result<Self> {
        let tracker = parse_tracker(definition.config.get("tracker"))?;
        let polling = parse_polling(definition.config.get("polling"))?;
        let workspace = parse_workspace(definition.config.get("workspace"))?;
        let hooks = parse_hooks(definition.config.get("hooks"))?;
        let agent = parse_agent(definition.config.get("agent"))?;
        let codex = parse_codex(definition.config.get("codex"))?;

        let config = Self {
            workflow_path: definition.path.clone(),
            tracker,
            polling,
            workspace,
            hooks,
            agent,
            codex,
        };
        config.validate_dispatch_config()?;
        Ok(config)
    }

    pub fn validate_dispatch_config(&self) -> Result<()> {
        if self.tracker.kind != "linear" {
            return Err(SymphonyError::UnsupportedTrackerKind {
                kind: self.tracker.kind.clone(),
            });
        }

        if self
            .tracker
            .api_key
            .as_ref()
            .is_none_or(|value| value.expose_secret().trim().is_empty())
        {
            return Err(SymphonyError::MissingTrackerApiKey);
        }

        if self
            .tracker
            .project_slug
            .as_ref()
            .is_none_or(|slug| slug.trim().is_empty())
        {
            return Err(SymphonyError::MissingTrackerProjectSlug);
        }

        if self.codex.command.trim().is_empty() {
            return Err(SymphonyError::MissingCodexCommand);
        }

        Ok(())
    }

    #[must_use]
    pub fn active_states_normalized(&self) -> HashSet<String> {
        self.tracker
            .active_states
            .iter()
            .map(|state| normalize_state(state))
            .collect()
    }

    #[must_use]
    pub fn terminal_states_normalized(&self) -> HashSet<String> {
        self.tracker
            .terminal_states
            .iter()
            .map(|state| normalize_state(state))
            .collect()
    }
}

fn parse_tracker(value: Option<&Value>) -> Result<TrackerConfig> {
    let object = value.and_then(Value::as_object);
    let kind = get_string(object, "kind")
        .unwrap_or_else(|| "linear".to_string())
        .to_lowercase();
    let endpoint =
        get_string(object, "endpoint").unwrap_or_else(|| DEFAULT_LINEAR_ENDPOINT.to_string());
    let api_key = get_string(object, "api_key")
        .and_then(|raw| resolve_secret_env(&raw))
        .or_else(|| {
            std::env::var("LINEAR_API_KEY")
                .ok()
                .filter(|value| !value.trim().is_empty())
                .map(Secret::new)
        });
    let project_slug = get_string(object, "project_slug").filter(|value| !value.trim().is_empty());
    let active_states = get_string_list(object, "active_states")
        .unwrap_or_else(|| vec!["Todo".to_string(), "In Progress".to_string()]);
    let terminal_states = get_string_list(object, "terminal_states").unwrap_or_else(|| {
        vec![
            "Closed".to_string(),
            "Cancelled".to_string(),
            "Canceled".to_string(),
            "Duplicate".to_string(),
            "Done".to_string(),
        ]
    });

    Ok(TrackerConfig {
        kind,
        endpoint,
        api_key,
        project_slug,
        active_states,
        terminal_states,
    })
}

fn parse_polling(value: Option<&Value>) -> Result<PollingConfig> {
    let object = value.and_then(Value::as_object);
    let interval_ms = get_u64(object, "interval_ms").unwrap_or(DEFAULT_POLL_INTERVAL_MS);
    if interval_ms == 0 {
        return Err(SymphonyError::InvalidConfig {
            field: "polling.interval_ms",
            message: "must be positive".to_string(),
        });
    }
    Ok(PollingConfig { interval_ms })
}

fn parse_workspace(value: Option<&Value>) -> Result<WorkspaceConfig> {
    let object = value.and_then(Value::as_object);
    let root = get_string(object, "root")
        .map(|raw| expand_path_like(&raw))
        .unwrap_or_else(default_workspace_root);
    ensure_path_like("workspace.root", &root)?;
    Ok(WorkspaceConfig { root })
}

fn parse_hooks(value: Option<&Value>) -> Result<HooksConfig> {
    let object = value.and_then(Value::as_object);
    let timeout_ms = get_u64(object, "timeout_ms")
        .filter(|value| *value > 0)
        .unwrap_or(DEFAULT_HOOK_TIMEOUT_MS);
    Ok(HooksConfig {
        after_create: get_string(object, "after_create"),
        before_run: get_string(object, "before_run"),
        after_run: get_string(object, "after_run"),
        before_remove: get_string(object, "before_remove"),
        timeout_ms,
    })
}

fn parse_agent(value: Option<&Value>) -> Result<AgentConfig> {
    let object = value.and_then(Value::as_object);
    let max_concurrent_agents = parse_positive_u32(object, "max_concurrent_agents")
        .unwrap_or(DEFAULT_MAX_CONCURRENT_AGENTS);
    let max_turns = parse_positive_u32(object, "max_turns").unwrap_or(DEFAULT_MAX_TURNS);
    let max_retry_backoff_ms =
        get_u64(object, "max_retry_backoff_ms").unwrap_or(DEFAULT_MAX_RETRY_BACKOFF_MS);
    let max_concurrent_agents_by_state = object
        .and_then(|map| map.get("max_concurrent_agents_by_state"))
        .and_then(Value::as_object)
        .map(|entries| {
            entries
                .iter()
                .filter_map(|(state, value)| {
                    value
                        .as_u64()
                        .and_then(|parsed| u32::try_from(parsed).ok())
                        .filter(|parsed| *parsed > 0)
                        .map(|parsed| (normalize_state(state), parsed))
                })
                .collect::<HashMap<_, _>>()
        })
        .unwrap_or_default();

    Ok(AgentConfig {
        max_concurrent_agents,
        max_turns,
        max_retry_backoff_ms,
        max_concurrent_agents_by_state,
    })
}

fn parse_codex(value: Option<&Value>) -> Result<CodexConfig> {
    let object = value.and_then(Value::as_object);
    let command =
        get_string(object, "command").unwrap_or_else(|| DEFAULT_CODEX_COMMAND.to_string());
    if command.trim().is_empty() {
        return Err(SymphonyError::MissingCodexCommand);
    }

    Ok(CodexConfig {
        command,
        approval_policy: get_string(object, "approval_policy"),
        thread_sandbox: get_string(object, "thread_sandbox"),
        turn_sandbox_policy: object
            .and_then(|map| map.get("turn_sandbox_policy"))
            .cloned(),
        turn_timeout_ms: get_u64(object, "turn_timeout_ms").unwrap_or(DEFAULT_TURN_TIMEOUT_MS),
        read_timeout_ms: get_u64(object, "read_timeout_ms").unwrap_or(DEFAULT_READ_TIMEOUT_MS),
        stall_timeout_ms: get_i64(object, "stall_timeout_ms").unwrap_or(DEFAULT_STALL_TIMEOUT_MS),
    })
}

fn get_string(map: Option<&serde_json::Map<String, Value>>, key: &str) -> Option<String> {
    let value = map?.get(key)?;
    match value {
        Value::String(inner) => Some(inner.clone()),
        Value::Number(number) => Some(number.to_string()),
        _ => None,
    }
}

fn get_string_list(map: Option<&serde_json::Map<String, Value>>, key: &str) -> Option<Vec<String>> {
    map?.get(key)?.as_array().map(|items| {
        items
            .iter()
            .filter_map(|item| item.as_str().map(ToString::to_string))
            .collect()
    })
}

fn get_u64(map: Option<&serde_json::Map<String, Value>>, key: &str) -> Option<u64> {
    let value = map?.get(key)?;
    match value {
        Value::Number(number) => number.as_u64(),
        Value::String(raw) => raw.parse().ok(),
        _ => None,
    }
}

fn get_i64(map: Option<&serde_json::Map<String, Value>>, key: &str) -> Option<i64> {
    let value = map?.get(key)?;
    match value {
        Value::Number(number) => number.as_i64(),
        Value::String(raw) => raw.parse().ok(),
        _ => None,
    }
}

fn parse_positive_u32(map: Option<&serde_json::Map<String, Value>>, key: &str) -> Option<u32> {
    get_u64(map, key)
        .and_then(|value| u32::try_from(value).ok())
        .filter(|value| *value > 0)
}

fn ensure_path_like(field: &'static str, path: &Path) -> Result<()> {
    if path.as_os_str().is_empty() {
        return Err(SymphonyError::InvalidConfig {
            field,
            message: "must not be empty".to_string(),
        });
    }
    Ok(())
}

fn default_workspace_root() -> PathBuf {
    std::env::temp_dir().join("symphony_workspaces")
}

fn expand_path_like(raw: &str) -> PathBuf {
    let resolved = if let Some(stripped) = raw.strip_prefix('$') {
        std::env::var(stripped).unwrap_or_default()
    } else {
        raw.to_string()
    };

    if let Some(stripped) = resolved.strip_prefix("~/")
        && let Some(home) = dirs_next::home_dir()
    {
        return home.join(stripped);
    }

    PathBuf::from(resolved)
}

fn resolve_secret_env(raw: &str) -> Option<Secret<String>> {
    if let Some(var_name) = raw.strip_prefix('$') {
        let value = std::env::var(var_name).ok()?;
        if value.trim().is_empty() {
            return None;
        }
        return Some(Secret::new(value));
    }

    if raw.trim().is_empty() {
        None
    } else {
        Some(Secret::new(raw.to_string()))
    }
}

#[must_use]
pub fn normalize_state(state: &str) -> String {
    state.to_ascii_lowercase()
}

#[cfg(test)]
#[allow(clippy::expect_used, clippy::unwrap_used)]
mod tests {
    use {super::*, std::collections::BTreeMap};

    fn workflow(config: BTreeMap<String, Value>) -> WorkflowDefinition {
        WorkflowDefinition {
            path: PathBuf::from("WORKFLOW.md"),
            config,
            prompt_template: "Prompt".to_string(),
        }
    }

    #[test]
    fn loads_defaults() {
        let definition = workflow(BTreeMap::new());
        let config = ServiceConfig::from_workflow(&definition).unwrap_err();
        assert!(matches!(config, SymphonyError::MissingTrackerApiKey));
    }

    #[test]
    fn accepts_literal_tracker_api_key() {
        let mut config = BTreeMap::new();
        config.insert(
            "tracker".to_string(),
            serde_json::json!({
                "kind": "linear",
                "project_slug": "proj",
                "api_key": "secret",
            }),
        );
        let parsed = ServiceConfig::from_workflow(&workflow(config)).unwrap();
        assert_eq!(
            parsed.tracker.api_key.as_ref().unwrap().expose_secret(),
            "secret"
        );
    }

    #[test]
    fn normalizes_per_state_limits() {
        let mut config = BTreeMap::new();
        config.insert(
            "tracker".to_string(),
            serde_json::json!({
                "kind": "linear",
                "project_slug": "proj",
                "api_key": "secret",
            }),
        );
        config.insert(
            "agent".to_string(),
            serde_json::json!({
                "max_concurrent_agents_by_state": {
                    "In Progress": 2,
                    "Blocked": 0,
                }
            }),
        );
        let parsed = ServiceConfig::from_workflow(&workflow(config)).unwrap();
        assert_eq!(
            parsed
                .agent
                .max_concurrent_agents_by_state
                .get("in progress"),
            Some(&2)
        );
        assert!(
            !parsed
                .agent
                .max_concurrent_agents_by_state
                .contains_key("blocked")
        );
    }
}
