// agent/src/processor/processor.rs

use crate::communicator;
use crate::config::Settings;
use super::models::{EventPayload, SysmonEvent};
use super::linux_parser; // Import the new parser
use quick_xml::de::from_str;

pub async fn process_event(event_data: &str, settings: &Settings) {
    let payload: Option<EventPayload> = None;

    // --- Parsing Pipeline ---

    // 1. Try to parse as a structured Windows Sysmon event.
    if let Ok(event) = from_str::<SysmonEvent>(event_data) {
        println!("Processed as a structured Windows event.");
        let payload = Some(EventPayload::Windows(event));
        let _ = communicator::communicator::send_event(&payload.unwrap(), &settings.server.url).await;
        return;
    }

    // 2. If that fails, try to parse as a structured Linux auditd event.
    if let Some(event) = linux_parser::parse_audit_message(event_data) {
        println!("Processed as a structured Linux event.");
        let payload = Some(EventPayload::Linux(event));
         let _ = communicator::communicator::send_event(&payload.unwrap(), &settings.server.url).await;
        return;
    }

    // 3. If all parsing fails, we log it. In a real scenario, we might send it as raw data.
    println!("Failed to parse event data into any known structured format.");
    // Optionally, we could still send the raw data if needed:
    // let payload = EventPayload::Raw(event_data.to_string());
    // let _ = communicator::communicator::send_event(&payload, &settings.server.url).await;
}
