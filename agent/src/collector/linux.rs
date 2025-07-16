// src/collector/linux.rs

use crossbeam_channel::Sender;
use audit::{new_audit_connection, get_audit_messages};
use tracing::{info, error};

pub fn collect_events_os(tx: Sender<String>) {
    info!("Starting event collection (Linux)...");
    
    let stream = match new_audit_connection() {
        Ok(s) => s,
        Err(e) => {
            error!(error = %e, "FATAL: Could not connect to audit daemon.");
            error!("Please ensure the auditd service is running and you have the required capabilities (CAP_AUDIT_READ, CAP_AUDIT_WRITE).");
            return;
        }
    };

    info!("Successfully connected to audit daemon.");

    for message in get_audit_messages(stream) {
        match message {
            Ok(msg) => {
                let raw_message = String::from_utf8_lossy(&msg.data).to_string();
                if tx.send(raw_message).is_err() {
                    error!("Channel disconnected. Stopping event collection.");
                    break;
                }
            }
            Err(e) => {
                error!(error = %e, "Error receiving audit message.");
            }
        }
    }
}
