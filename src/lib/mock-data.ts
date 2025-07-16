import { Alert, SysmonEvent, TimelineDataPoint, RuleFile, AppSettings } from "./types";

export const recentAlerts: Alert[] = [
  // ...
];

export const timelineData: TimelineDataPoint[] = [
  // ...
];

export const sysmonEvents: SysmonEvent[] = [];

export const yaraRules: RuleFile[] = [
  // ...
];

export const sysmonRules: RuleFile[] = [
  // ...
];

export const appSettings: AppSettings = {
  general: { appName: "ThreatHawk", darkMode: true, eventRetentionDays: 90 },
  integrations: {
    // The API key is now removed from the source code.
    // It will be loaded from environment variables in a real implementation.
    virustotalApiKey: "", 
    splunkUrl: "https://mock-splunk.example.com"
  },
  notifications: {
    emailEnabled: true,
    emailAddress: "admin@example.com",
    slackWebhookUrl: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
  },
  agentManagement: {
    agentUpdateChannel: "stable",
    maxAgentCpuUsage: 75,
    maxAgentMemoryUsage: 200
  },
};
