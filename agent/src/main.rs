// agent/src/main.rs

use std::thread;
use std::time::Duration;
use tokio::time::interval;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

mod collector;
mod communicator;
mod config;
mod monitor;
mod processor;
mod queue_manager;
mod responder;

use config::Settings;

#[tokio::main]
async fn main() {
    // --- Initialize Production Logger ---
    // This sets up a global logger that prints structured JSON to stdout.
    // In a real production env, this could be configured to write to a file
    // or send logs to a service like Datadog or Splunk.
    tracing_subscriber::registry().with(fmt::layer().json()).init();

    tracing::info!("Logger initialized. Starting Sysmon Sentinel Agent...");

    let settings = match Settings::new() {
        Ok(s) => {
            tracing::info!("Configuration loaded successfully.");
            s
        }
        Err(e) => {
            tracing::error!(error = %e, "FATAL: Failed to load configuration.");
            return;
        }
    };
    
    communicator::initialize_client(&settings.security);
    
    tracing::info!(agent_id = %settings.agent_id, "Agent starting up.");

    // ... (rest of the main function remains the same)

    let (tx, rx) = crossbeam_channel::unbounded();
    let settings_clone_responder = settings.clone();
    let settings_clone_queue = settings.clone();

    let collector_handle = thread::spawn(move || {
        collector::collector::collect_events(tx);
    });
    tracing::info!("Event collector started.");

    let command_handle = tokio::spawn(async move {
        let mut interval = interval(Duration::from_secs(30));
        loop {
            interval.tick().await;
            responder::responder::check_for_commands(&settings_clone_responder).await;
        }
    });
    tracing::info!("Command checker started.");

    let queue_handle = tokio::spawn(async move {
        queue_manager::process_queue(&settings_clone_queue).await;
    });
    tracing::info!("Queue manager started.");

    loop {
        match rx.recv() {
            Ok(event_xml) => {
                let settings_clone_processor = settings.clone();
                tokio::spawn(async move {
                    processor::processor::process_event(&event_xml, &settings_clone_processor).await;
                });
            }
            Err(_) => {
                tracing::error!("Collector thread has terminated. Shutting down.");
                break;
            }
        }
    }
}
