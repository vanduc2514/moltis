use std::{
    path::{Path, PathBuf},
    process::Stdio,
};

use tokio::process::Command;

use crate::{
    config::HooksConfig,
    error::{Result, SymphonyError},
    models::Workspace,
};

pub struct WorkspaceManager {
    root: PathBuf,
    hooks: HooksConfig,
}

impl WorkspaceManager {
    #[must_use]
    pub fn new(root: PathBuf, hooks: HooksConfig) -> Self {
        Self { root, hooks }
    }

    #[must_use]
    pub fn root(&self) -> &Path {
        &self.root
    }

    pub async fn prepare(&self, issue_identifier: &str) -> Result<Workspace> {
        std::fs::create_dir_all(&self.root)?;

        let workspace_key = workspace_key(issue_identifier);
        let path = self.root.join(&workspace_key);
        ensure_workspace_within_root(&self.root, &path)?;

        if path.exists() && !path.is_dir() {
            return Err(SymphonyError::WorkspacePathNotDirectory { path });
        }

        let created_now = if path.exists() {
            false
        } else {
            std::fs::create_dir_all(&path)?;
            true
        };

        if created_now && let Some(script) = self.hooks.after_create.as_deref() {
            run_hook("after_create", script, &path, self.hooks.timeout_ms).await?;
        }

        Ok(Workspace {
            path,
            workspace_key,
            created_now,
        })
    }

    pub async fn run_before_remove(&self, workspace: &Path) -> Result<()> {
        if let Some(script) = self.hooks.before_remove.as_deref() {
            run_hook_best_effort("before_remove", script, workspace, self.hooks.timeout_ms).await;
        }
        Ok(())
    }
}

#[must_use]
pub fn workspace_key(identifier: &str) -> String {
    identifier
        .chars()
        .map(|ch| {
            if ch.is_ascii_alphanumeric() || matches!(ch, '.' | '_' | '-') {
                ch
            } else {
                '_'
            }
        })
        .collect()
}

pub fn ensure_workspace_within_root(root: &Path, path: &Path) -> Result<()> {
    let absolute_root = normalize_path(&absolute_path(root)?);
    let absolute_path = normalize_path(&absolute_path(path)?);
    if !absolute_path.starts_with(&absolute_root) {
        return Err(SymphonyError::WorkspacePathEscape {
            root: absolute_root,
            path: absolute_path,
        });
    }
    Ok(())
}

pub async fn run_hook(name: &'static str, script: &str, cwd: &Path, timeout_ms: u64) -> Result<()> {
    let shell = if cfg!(windows) {
        "cmd"
    } else {
        "bash"
    };
    let args = if cfg!(windows) {
        vec!["/C", script]
    } else {
        vec!["-lc", script]
    };

    let mut command = Command::new(shell);
    command
        .args(args)
        .current_dir(cwd)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let output = tokio::time::timeout(
        std::time::Duration::from_millis(timeout_ms),
        command.output(),
    )
    .await
    .map_err(|_| SymphonyError::HookTimedOut { name, timeout_ms })??;

    if output.status.success() {
        return Ok(());
    }

    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let message = if !stderr.is_empty() {
        stderr
    } else if !stdout.is_empty() {
        stdout
    } else {
        format!("exit status {}", output.status)
    };
    Err(SymphonyError::HookFailed {
        name,
        message: truncate_for_log(&message),
    })
}

pub async fn run_hook_best_effort(name: &'static str, script: &str, cwd: &Path, timeout_ms: u64) {
    if let Err(error) = run_hook(name, script, cwd, timeout_ms).await {
        tracing::warn!(hook = name, error = %error, "best-effort workspace hook failed");
    }
}

fn absolute_path(path: &Path) -> Result<PathBuf> {
    if path.is_absolute() {
        Ok(path.to_path_buf())
    } else {
        Ok(std::env::current_dir()?.join(path))
    }
}

fn normalize_path(path: &Path) -> PathBuf {
    let mut normalized = PathBuf::new();
    for component in path.components() {
        match component {
            std::path::Component::CurDir => {},
            std::path::Component::ParentDir => {
                normalized.pop();
            },
            _ => normalized.push(component.as_os_str()),
        }
    }
    normalized
}

fn truncate_for_log(value: &str) -> String {
    const MAX_LEN: usize = 200;
    if value.len() <= MAX_LEN {
        value.to_string()
    } else {
        format!("{}...[truncated]", &value[..MAX_LEN])
    }
}

#[cfg(test)]
#[allow(clippy::expect_used, clippy::unwrap_used)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn sanitizes_workspace_key() {
        assert_eq!(workspace_key("ABC-123/hello"), "ABC-123_hello");
    }

    #[tokio::test]
    async fn prepares_workspace_inside_root() {
        let temp = tempfile::tempdir().unwrap();
        let manager = WorkspaceManager::new(temp.path().join("workspaces"), HooksConfig::default());
        let workspace = manager.prepare("MT-9").await.unwrap();
        assert!(workspace.path.exists());
        assert!(workspace.created_now);
    }

    #[tokio::test]
    async fn after_create_hook_runs_once() {
        let temp = tempfile::tempdir().unwrap();
        let marker = temp.path().join("marker.txt");
        let manager = WorkspaceManager::new(temp.path().join("workspaces"), HooksConfig {
            after_create: Some(format!("echo created > {}", marker.display())),
            timeout_ms: 2_000,
            ..HooksConfig::default()
        });
        manager.prepare("MT-10").await.unwrap();
        assert!(marker.exists());
        std::fs::remove_file(&marker).unwrap();
        let workspace = manager.prepare("MT-10").await.unwrap();
        assert!(!workspace.created_now);
        assert!(!marker.exists());
    }
}
