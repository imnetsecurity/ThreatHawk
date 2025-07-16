// agent/src/queue_manager/mod.rs

use crate::communicator;
use crate::config::Settings;
use crate::processor::models::EventPayload; // Import the new enum
use std::fs;
use std::path::PathBuf;
use tokio::time::{self, Duration};

const QUEUE_DIR: &str = "agent/queue";

pub async fn process_queue(settings: &Settings) {
    let mut interval = time::interval(Duration::from_secs(60));
    loop {
        interval.tick().await;
        if let Ok(paths) = fs::read_dir(QUEUE_DIR) {
            for path in paths {
                if let Ok(path) = path {
                    process_queued_file(path.path(), settings).await;
                }
            }
        }
    }
}

async fn process_queued_file(path: PathBuf, settings: &Settings) {
    if let Ok(data) = fs::read_to_string(&path) {
        // Deserialize into our new EventPayload enum
        if let Ok(payload) = serde_json::from_str::<EventPayload>(&data) {
            // Attempt to re-send it
            if communicator::communicator::send_event(&payload, &settings.server.url).await.is_ok() {
                let _ = fs::remove_file(&path);
            }
        }
    }
}
