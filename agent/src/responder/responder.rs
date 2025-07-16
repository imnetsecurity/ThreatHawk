// agent/src/responder/responder.rs

use super::Command; // Import Command from the parent module (mod.rs)
use crate::config::Settings;
use once_cell::sync::Lazy;

// Create a static registry of all available actions.
static ACTION_REGISTRY: Lazy<super::actions::ActionRegistry> = Lazy::new(super::actions::get_action_registry);

pub async fn check_for_commands(settings: &Settings) {
    let client = crate::communicator::HTTP_CLIENT.get().expect("HTTP Client not initialized");
    let url = format!("{}/commands/{}", settings.server.url, settings.agent_id);
    
    if let Ok(response) = client.get(&url).send().await {
        if let Ok(commands) = response.json::<Vec<Command>>().await {
            for cmd in commands {
                execute_command(cmd).await;
            }
        }
    }
}

async fn execute_command(cmd: Command) {
    println!("Received command: '{}' for target '{}'", cmd.action, cmd.target);
    
    if let Some(action) = ACTION_REGISTRY.get(cmd.action.as_str()) {
        action.execute(&cmd.target).await;
    } else {
        eprintln!("Unknown command action received: {}", cmd.action);
    }
}
