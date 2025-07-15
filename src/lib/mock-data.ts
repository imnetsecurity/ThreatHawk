import { Alert, SysmonEvent, TimelineDataPoint, RuleFile } from "./types";

export const recentAlerts: Alert[] = [];

export const timelineData: TimelineDataPoint[] = [];

export const sysmonEvents: SysmonEvent[] = [];

export const yaraRules: RuleFile[] = [
  { id: "yr-1", name: "new_rule.yar", content: "rule new_rule\n{\n  condition:\n    false\n}" },
];

export const sysmonRules: RuleFile[] = [
  { id: "sr-1", name: "new_config.xml", content: "<Sysmon schemaversion=\"4.90\">\n  <EventFiltering>\n    <RuleGroup name=\"New Rules\" groupRelation=\"or\">\n      <!-- Add new rules here -->\n    </RuleGroup>\n  </EventFiltering>\n</Sysmon>" },
];
