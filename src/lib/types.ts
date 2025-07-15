export type SysmonEvent = {
  id: string;
  timestamp: string;
  agent: {
    id: string;
    hostname: string;
    ip: string;
  };
  event: {
    id: number;
    name: string;
  };
  process: {
    pid: number;
    name: string;
    path: string;
    commandLine: string;
    hash?: string;
  };
  parentProcess?: {
    pid: number;
    name: string;
  };
  network?: {
    destinationIp: string;
    destinationPort: number;
    protocol: string;
  };
  user?: {
    name: string;
    domain: string;
  };
  fullData: Record<string, any>;
};

export type Alert = {
  id: string;
  timestamp: string;
  severity: "Critical" | "Warning" | "Informational";
  description: string;
  agentHostname: string;
  status: "New" | "Acknowledged" | "Escalated" | "Closed";
  source: "AI Anomaly" | "YARA Match" | "Policy";
};

export type TimelineDataPoint = {
  hour: number;
  critical: number;
  warning: number;
  informational: number;
};

export type RuleFile = {
  id: string;
  name: string;
  content: string;
};

export type YaraScanResult = {
  didMatch: boolean;
  ruleName?: string;
  details?: string;
};
