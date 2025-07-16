// agent/src/responder/actions/kill_process.rs

use super::Action;
use async_trait::async_trait;
use std::process;

pub struct KillProcess;

#[async_trait]
impl Action for KillProcess {
    fn name(&self) -> &'static str {
        "kill_process"
    }

    async fn execute(&self, target: &str) {
        println!("[ACTION] Executing kill_process on target: {}", target);
        
        #[cfg(not(target_os = "windows"))]
        {
            let status = process::Command::new("pkill").arg(target).status();
            match status {
                Ok(s) if s.success() => println!("Successfully terminated '{}'.", target),
                _ => eprintln!("Could not find or terminate '{}'.", target),
            }
        }

        #[cfg(target_os = "windows")]
        {
            println!("[PENDING] Windows implementation for killing process.");
        }
    }
}
