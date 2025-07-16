// agent/src/responder/actions/quarantine_file.rs

use super::Action;
use async_trait::async_trait;
use std::fs;
use std::os::unix::fs::PermissionsExt;

pub struct QuarantineFile;

#[async_trait]
impl Action for QuarantineFile {
    fn name(&self) -> &'static str {
        "quarantine_file"
    }

    async fn execute(&self, target: &str) {
        println!("[ACTION] Executing quarantine_file on target: {}", target);
        
        #[cfg(not(target_os = "windows"))]
        {
            match fs::metadata(target) {
                Ok(_) => {
                    let perms = fs::Permissions::from_mode(0o000);
                    if fs::set_permissions(target, perms).is_ok() {
                        println!("Successfully quarantined '{}'.", target);
                    } else {
                        eprintln!("Failed to set permissions for '{}'.", target);
                    }
                }
                Err(_) => eprintln!("File '{}' not found for quarantine.", target),
            }
        }
        
        #[cfg(target_os = "windows")]
        {
            println!("[PENDING] Windows implementation for quarantining file.");
        }
    }
}
