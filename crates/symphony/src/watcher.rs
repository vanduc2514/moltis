use std::path::PathBuf;

use {
    notify_debouncer_full::{
        DebounceEventResult, Debouncer, RecommendedCache, new_debouncer, notify::RecursiveMode,
    },
    tokio::sync::mpsc,
};

use crate::error::Result;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum WorkflowWatchEvent {
    Changed,
}

pub struct WorkflowWatcher {
    _debouncer: Debouncer<notify_debouncer_full::notify::RecommendedWatcher, RecommendedCache>,
}

impl WorkflowWatcher {
    pub fn start(
        workflow_path: PathBuf,
    ) -> Result<(Self, mpsc::UnboundedReceiver<WorkflowWatchEvent>)> {
        let (tx, rx) = mpsc::unbounded_channel();
        let watch_dir = workflow_path
            .parent()
            .map(PathBuf::from)
            .unwrap_or_else(|| PathBuf::from("."));
        let target = workflow_path;

        let debouncer = new_debouncer(
            std::time::Duration::from_millis(500),
            None,
            move |result: DebounceEventResult| match result {
                Ok(events) => {
                    let changed = events
                        .iter()
                        .any(|event| event.paths.iter().any(|path| path == &target));
                    if changed {
                        let _ = tx.send(WorkflowWatchEvent::Changed);
                    }
                },
                Err(errors) => {
                    for error in errors {
                        tracing::warn!(error = %error, "workflow watcher error");
                    }
                },
            },
        )?;

        let mut watcher = Self {
            _debouncer: debouncer,
        };
        watcher
            ._debouncer
            .watch(&watch_dir, RecursiveMode::NonRecursive)?;

        Ok((watcher, rx))
    }
}
