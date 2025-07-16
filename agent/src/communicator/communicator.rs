// agent/src/communicator/communicator.rs

use crate::processor::models::EventPayload;
use crate::config::Security;
use once_cell::sync::OnceCell;
use reqwest::Client;
use std::fs;
use std::path::Path;
use uuid::Uuid;

const QUEUE_DIR: &str = "agent/queue";

static HTTP_CLIENT: OnceCell<Client> = OnceCell::new();

// This function now just creates a basic client.
pub fn initialize_client(_sec_config: &Security) {
    let client = Client::builder()
        .build()
        .expect("Failed to build reqwest client");
    HTTP_CLIENT.set(client).expect("HTTP Client already initialized");
}

pub async fn send_event(payload: &EventPayload, server_url: &str) -> Result<(), ()> {
    let client = HTTP_CLIENT.get().expect("HTTP Client not initialized");
    let url = format!("{}/ingest", server_url);
    
    match client.post(&url).json(payload).send().await {
        Ok(response) if response.status().is_success() => Ok(()),
        _ => {
            save_event_to_queue(payload);
            Err(())
        }
    }
}

fn save_event_to_queue(payload: &EventPayload) {
    let file_id = Uuid::new_v4().to_string();
    let file_path = Path::new(QUEUE_DIR).join(format!("{}.json", file_id));
    
    if let Ok(json) = serde_json::to_string(payload) {
        let _ = fs::write(&file_path, json);
    }
}
