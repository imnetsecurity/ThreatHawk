// agent/src/processor/linux_parser.rs

use super::models::LinuxAuditEvent;
use std::collections::HashMap;

// Parses a raw auditd message string into our structured format.
pub fn parse_audit_message(raw_data: &str) -> Option<LinuxAuditEvent> {
    let mut fields = HashMap::new();
    
    // The timestamp is usually in the format "audit(1678886400.123:456):"
    // We'll extract the numeric part.
    let timestamp = raw_data
        .split_once(':')
        .and_then(|(s, _)| s.split_once('('))
        .map(|(_, ts)| ts)
        .unwrap_or("unknown")
        .to_string();

    // The rest of the message is a series of space-separated key=value pairs.
    for part in raw_data.split_whitespace() {
        if let Some((key, value)) = part.split_once('=') {
            // Values might be quoted, so we remove them.
            fields.insert(key.to_string(), value.trim_matches('"').to_string());
        }
    }
    
    // If we have no fields, it's probably not a valid message.
    if fields.is_empty() {
        return None;
    }

    // Create the structured event from the parsed fields.
    let mut event = LinuxAuditEvent {
        timestamp,
        uid: fields.remove("uid"),
        gid: fields.remove("gid"),
        pid: fields.remove("pid"),
        comm: fields.remove("comm"),
        exe: fields.remove("exe"),
        syscall: fields.remove("syscall"),
        success: fields.remove("success"),
        other_fields: fields, // The rest of the fields go here.
    };
    
    Some(event)
}
