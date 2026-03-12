use std::path::PathBuf;

use tokio::sync::mpsc;

use crate::{
    config::ServiceConfig,
    error::Result,
    models::WorkflowDefinition,
    watcher::{WorkflowWatchEvent, WorkflowWatcher},
    workflow::{load_workflow, resolve_workflow_path},
};

#[derive(Debug, Clone)]
pub struct RunOptions {
    pub workflow_path: Option<PathBuf>,
    pub once: bool,
}

#[derive(Debug, Clone)]
pub struct SymphonyRuntime {
    workflow: WorkflowDefinition,
    config: ServiceConfig,
}

impl SymphonyRuntime {
    pub fn load(workflow_path: Option<PathBuf>) -> Result<Self> {
        let path = resolve_workflow_path(workflow_path.as_deref());
        let workflow = load_workflow(&path)?;
        let config = ServiceConfig::from_workflow(&workflow)?;
        Ok(Self { workflow, config })
    }

    #[must_use]
    pub fn config(&self) -> &ServiceConfig {
        &self.config
    }

    #[must_use]
    pub fn workflow(&self) -> &WorkflowDefinition {
        &self.workflow
    }

    pub fn reload(&mut self) -> Result<()> {
        let workflow = load_workflow(&self.workflow.path)?;
        let config = ServiceConfig::from_workflow(&workflow)?;
        self.workflow = workflow;
        self.config = config;
        Ok(())
    }
}

#[cfg_attr(feature = "tracing", tracing::instrument(skip_all))]
pub async fn run_service(options: RunOptions) -> anyhow::Result<()> {
    let mut runtime = SymphonyRuntime::load(options.workflow_path)?;
    tracing::info!(
        workflow_path = %runtime.workflow().path.display(),
        poll_interval_ms = runtime.config().polling.interval_ms,
        workspace_root = %runtime.config().workspace.root.display(),
        "symphony runtime ready"
    );

    if options.once {
        return Ok(());
    }

    let (_watcher, mut rx) = WorkflowWatcher::start(runtime.workflow().path.clone())?;
    run_loop(&mut runtime, &mut rx).await?;
    Ok(())
}

async fn run_loop(
    runtime: &mut SymphonyRuntime,
    rx: &mut mpsc::UnboundedReceiver<WorkflowWatchEvent>,
) -> anyhow::Result<()> {
    let mut interval = tokio::time::interval(std::time::Duration::from_millis(
        runtime.config().polling.interval_ms,
    ));
    interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);

    loop {
        tokio::select! {
            _ = tokio::signal::ctrl_c() => {
                tracing::info!("symphony shutdown requested");
                return Ok(());
            }
            Some(WorkflowWatchEvent::Changed) = rx.recv() => {
                match runtime.reload() {
                    Ok(()) => {
                        tracing::info!(
                            workflow_path = %runtime.workflow().path.display(),
                            poll_interval_ms = runtime.config().polling.interval_ms,
                            "reloaded symphony workflow"
                        );
                        interval = tokio::time::interval(std::time::Duration::from_millis(
                            runtime.config().polling.interval_ms,
                        ));
                        interval.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
                    }
                    Err(error) => {
                        tracing::warn!(error = %error, "invalid workflow reload ignored");
                    }
                }
            }
            _ = interval.tick() => {
                tracing::info!(
                    workflow_path = %runtime.workflow().path.display(),
                    poll_interval_ms = runtime.config().polling.interval_ms,
                    dispatch_enabled = false,
                    "symphony poll tick"
                );
            }
        }
    }
}

#[cfg(test)]
#[allow(clippy::expect_used, clippy::unwrap_used)]
mod tests {
    use super::*;

    #[test]
    fn invalid_reload_keeps_last_good_runtime() {
        let temp = tempfile::tempdir().unwrap();
        let path = temp.path().join("WORKFLOW.md");
        std::fs::write(
            &path,
            "---\ntracker:\n  kind: linear\n  api_key: secret\n  project_slug: moltis\n---\nHello {{ issue.title }}\n",
        )
        .unwrap();

        let mut runtime = SymphonyRuntime::load(Some(path.clone())).unwrap();
        std::fs::write(&path, "---\n- invalid\n---\nBroken\n").unwrap();

        assert!(runtime.reload().is_err());
        assert_eq!(runtime.config().tracker.kind, "linear");
        assert_eq!(
            runtime.workflow().prompt_template,
            "Hello {{ issue.title }}"
        );
    }
}
