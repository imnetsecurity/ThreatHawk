"use server";

import { detectBehavioralAnomaly } from "@/ai/flows/behavioral-anomaly-detection";
import { generateSysmonRule } from "@/ai/flows/ai-rule-generation";
import type { SysmonEvent } from "@/lib/types";

export async function analyzeEventForAnomalies(event: SysmonEvent) {
  const result = await detectBehavioralAnomaly({
    sysmonEventData: JSON.stringify(event.fullData, null, 2),
  });
  return result;
}

export async function createRuleFromAnomaly(
  anomalyDescription: string,
  event: SysmonEvent
) {
  const result = await generateSysmonRule({
    anomalyDescription,
    relevantSysmonEvents: JSON.stringify(event.fullData, null, 2),
  });
  return result;
}
