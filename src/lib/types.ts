export interface Alert {
  id: string;
  timestamp: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational" | "Warning";
  title: string;
  description: string;
  source: string;
  status: "New" | "Acknowledged" | "Escalated" | "Closed";
  host: string;
  ip_address: string;
  tags: string[];
}

export interface TimelineDataPoint {
  hour: number;
  informational: number;
  warning: number;
  critical: number;
}

export interface SysmonEvent {
  system: {
    provider: { name: string };
    event_id: number;
    time_created: { system_time: string };
    computer: string;
  };
  event_data: { data: Array<{ name: string; value: string }> };
  // Add fullData or other fields if you need them in the frontend
  // For consistency with the Rust agent's `EventPayload::Structured(SysmonEvent)`
  fullData?: any; // Placeholder for now, if original `event.fullData` was used
  process?: { hash?: string; [key: string]: any }; // Placeholder for process info
}

// --- NEW: Linux Auditd Event Structure ---
// Mirrors the Rust agent's LinuxAuditEvent
export interface LinuxAuditEvent {
  timestamp: string;
  uid?: string;
  gid?: string;
  pid?: string;
  comm?: string; // Command (process name)
  exe?: string;
  syscall?: string;
  success?: string;
  // Use a string index signature for `other_fields` similar to Rust's HashMap
  [key: string]: string | undefined; 
}

// --- NEW: Unified Event Payload ---
// Mirrors the Rust agent's EventPayload enum
export type EventPayload = 
  | { type: "windows_sysmon"; data: SysmonEvent }
  | { type: "linux_auditd"; data: LinuxAuditEvent };

export interface RuleFile {
  id: string;
  name: string;
  content: string;
}

export interface AppSettings {
  general: {
    appName: string;
    darkMode: boolean;
    eventRetentionDays: number;
  };
  integrations: {
    virustotalApiKey: string;
    splunkUrl: string;
  };
  notifications: {
    emailEnabled: boolean;
    emailAddress: string;
    slackWebhookUrl: string;
  };
  agentManagement: {
    agentUpdateChannel: string;
    maxAgentCpuUsage: number;
    maxAgentMemoryUsage: number; // MB
  };
}
