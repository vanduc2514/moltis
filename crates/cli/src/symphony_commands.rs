use std::path::PathBuf;

use clap::Subcommand;

#[derive(Subcommand)]
pub enum SymphonyAction {
    /// Validate a WORKFLOW.md file and print the effective runtime configuration.
    Validate {
        /// Optional path to WORKFLOW.md. Defaults to ./WORKFLOW.md.
        workflow_path: Option<PathBuf>,
    },
    /// Start the Symphony daemon skeleton with workflow reload support.
    Run {
        /// Optional path to WORKFLOW.md. Defaults to ./WORKFLOW.md.
        workflow_path: Option<PathBuf>,
        /// Validate and execute a single startup cycle, then exit.
        #[arg(long, default_value_t = false)]
        once: bool,
    },
}

pub async fn handle_symphony(action: SymphonyAction) -> anyhow::Result<()> {
    match action {
        SymphonyAction::Validate { workflow_path } => {
            let runtime = moltis_symphony::SymphonyRuntime::load(workflow_path)?;
            let config = runtime.config();

            println!("Workflow: {}", runtime.workflow().path.display());
            println!("Tracker: {}", config.tracker.kind);
            println!(
                "Project: {}",
                config
                    .tracker
                    .project_slug
                    .as_deref()
                    .unwrap_or("<missing>")
            );
            println!("Poll interval: {} ms", config.polling.interval_ms);
            println!("Workspace root: {}", config.workspace.root.display());
            println!("Codex command: {}", config.codex.command);
            println!(
                "Prompt template: {} chars",
                runtime.workflow().prompt_template.len()
            );
            Ok(())
        },
        SymphonyAction::Run {
            workflow_path,
            once,
        } => {
            moltis_symphony::run_service(moltis_symphony::RunOptions {
                workflow_path,
                once,
            })
            .await
        },
    }
}
