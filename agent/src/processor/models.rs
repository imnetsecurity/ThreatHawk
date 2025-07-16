// agent/src/processor/models.rs

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// --- The Unified Event Payload ---
// This enum now represents all types of structured data we can send.
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "event_source", content = "data")]
pub enum EventPayload {
    #[serde(rename = "windows_sysmon")]
    Windows(SysmonEvent),
    #[serde(rename = "linux_auditd")]
    Linux(LinuxAuditEvent),
}

// --- Linux Auditd Event Structure ---
// Represents a parsed auditd event. It contains common fields.
// `other_fields` is a catch-all for any other data in the message.
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct LinuxAuditEvent {
    pub timestamp: String,
    pub uid: Option<String>,
    pub gid: Option<String>,
    pub pid: Option<String>,
    pub comm: Option<String>, // Command (process name)
    pub exe: Option<String>,
    pub syscall: Option<String>,
    pub success: Option<String>,
    #[serde(flatten)]
    pub other_fields: HashMap<String, String>,
}

// --- Windows Sysmon Event Structures (mostly unchanged) ---
#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename = "Event")]
pub struct SysmonEvent {
    #[serde(rename = "System")]
    pub system: System,
    #[serde(rename = "EventData")]
    pub event_data: EventData,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct System {
    #[serde(rename = "Provider")]
    pub provider: Provider,
    #[serde(rename = "EventID")]
    pub event_id: u32,
    #[serde(rename = "TimeCreated")]
    pub time_created: TimeCreated,
    #[serde(rename = "Computer")]
    pub computer: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Provider {
    #[serde(rename = "@Name")]
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TimeCreated {
    #[serde(rename = "@SystemTime")]
    pub system_time: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct EventData {
    #[serde(rename = "Data")]
    pub data: Vec<DataPair>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct DataPair {
    #[serde(rename = "@Name")]
    pub name: String,
    #[serde(rename = "#text")]
    pub value: String,
}
