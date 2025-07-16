// agent/src/responder/actions/mod.rs

use async_trait::async_trait;
use std::collections::HashMap;
use std::sync::Arc;

// --- The Core Trait ---
// Any action the agent can perform must implement this trait.
// The `async_trait` macro allows us to have async functions in our trait.
#[async_trait]
pub trait Action: Send + Sync {
    // The name of the action, e.g., "kill_process"
    fn name(&self) -> &'static str;
    // The function that executes the action.
    async fn execute(&self, target: &str);
}

// --- Action Implementations ---
mod kill_process;
mod quarantine_file;

// --- Action Registry ---
// A type alias for our registry to make it cleaner.
type ActionRegistry = HashMap<&'static str, Arc<dyn Action>>;

// Create a function to build the registry of all available actions.
pub fn get_action_registry() -> ActionRegistry {
    let mut registry: ActionRegistry = HashMap::new();
    
    // Create instances of our actions
    let kill_action = Arc::new(kill_process::KillProcess);
    let quarantine_action = Arc::new(quarantine_file::QuarantineFile);

    // Register them
    registry.insert(kill_action.name(), kill_action);
    registry.insert(quarantine_action.name(), quarantine_action);
    
    registry
}
