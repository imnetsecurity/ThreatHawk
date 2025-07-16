// agent/src/config/mod.rs

use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Settings {
    pub agent_id: String,
    pub server: Server,
    pub security: Security,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Server {
    pub url: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Security {
    pub server_cert_path: String,
    pub agent_cert_path: String,
    pub agent_key_path: String,
}

impl Settings {
    pub fn new() -> Result<Self, config::ConfigError> {
        let s = config::Config::builder()
            // The config file is in the parent directory of where the agent binary runs from.
            .add_source(config::File::with_name("agent/agent.toml").required(true))
            .build()?;

        s.try_deserialize()
    }
}
