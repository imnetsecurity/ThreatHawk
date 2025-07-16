// agent/src/responder/mod.rs

use serde::Deserialize;

// Command struct used by the check_for_commands function.
#[derive(Debug, Deserialize)]
pub struct Command {
    pub id: String,
    pub action: String,
    pub target: String,
}

pub mod responder;
mod actions; // This is an internal submodule
