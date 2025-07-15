export interface SysmonCondition {
  id: string;
  field: string;
  conditionType: string;
  value: string;
}

export interface SysmonEventRule {
  id: string;
  eventType: string;
  onmatch: "include" | "exclude";
  groupRelation: "AND" | "OR";
  conditions: SysmonCondition[];
}

export interface SysmonRuleForgeOptions {
  ruleGroupName: string;
  topLevelGroupRelation: "AND" | "OR";
  eventRules: SysmonEventRule[];
}

export const availableEventTypes = [
  { id: 1, name: "ProcessCreate", commonFields: ["Image", "CommandLine", "ParentImage", "ParentCommandLine", "User", "Hashes"] },
  { id: 2, name: "FileCreateTime", commonFields: ["Image", "TargetFilename", "CreationUtcTime"] },
  { id: 3, name: "NetworkConnect", commonFields: ["Image", "User", "Protocol", "SourceIp", "SourcePort", "DestinationIp", "DestinationPort"] },
  { id: 4, name: "SysmonStateChange", commonFields: [] },
  { id: 5, name: "ProcessTerminate", commonFields: ["Image", "User"] },
  { id: 6, name: "DriverLoad", commonFields: ["ImageLoaded", "Signed", "Signature"] },
  { id: 7, name: "ImageLoad", commonFields: ["Image", "ImageLoaded", "Signed", "Signature"] },
  { id: 8, name: "CreateRemoteThread", commonFields: ["SourceImage", "TargetImage", "StartAddress"] },
  { id: 9, name: "RawAccessRead", commonFields: ["Image", "Device"] },
  { id: 10, name: "ProcessAccess", commonFields: ["SourceImage", "TargetImage", "GrantedAccess"] },
  { id: 11, name: "FileCreate", commonFields: ["Image", "TargetFilename"] },
  { id: 12, name: "RegistryEvent", commonFields: ["EventType", "TargetObject", "Image"] },
  { id: 13, name: "RegistryEvent", commonFields: ["EventType", "TargetObject", "Details", "Image"] },
  { id: 14, name: "RegistryEvent", commonFields: ["EventType", "TargetObject", "Image"] },
  { id: 15, name: "FileCreateStreamHash", commonFields: ["Image", "TargetFilename"] },
  { id: 17, name: "PipeEvent", commonFields: ["EventType", "PipeName", "Image"] },
  { id: 18, name: "PipeEvent", commonFields: ["EventType", "PipeName", "Image"] },
  { id: 19, name: "WmiEvent", commonFields: ["EventType", "User", "Operation", "Query"] },
  { id: 20, name: "WmiEvent", commonFields: ["EventType", "User", "Operation", "Query"] },
  { id: 21, name: "WmiEvent", commonFields: ["EventType", "User", "Operation", "Query"] },
  { id: 22, name: "DnsQuery", commonFields: ["QueryName", "Image", "QueryStatus", "QueryResults"] },
  { id: 23, name: "FileDelete", commonFields: ["Image", "TargetFilename", "IsExecutable"] },
  { id: 24, name: "ClipboardChange", commonFields: ["Image", "Session", "ClientInfo"] },
  { id: 25, name: "ProcessTampering", commonFields: ["Image", "Type", "TargetImage"] },
  { id: 26, name: "FileDeleteDetected", commonFields: ["Image", "TargetFilename", "IsExecutable"] },
];
