"use server";

import { detectBehavioralAnomaly } from "@/ai/flows/behavioral-anomaly-detection";
import { generateSysmonRule } from "@/ai/flows/ai-rule-generation";
import { performYaraScan } from "@/ai/flows/yara-scan-flow";
import type { SysmonEvent } from "@/lib/types";
import type { PerformYaraScanInput } from "@/ai/flows/yara-scan-flow";

export async function analyzeEventForAnomalies(event: SysmonEvent) {
  const result = await detectBehavioralAnomaly({
    sysmonEventData: JSON.stringify(event.fullData, null, 2),
    fileHash: event.process.hash,
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

export async function scanWithYara(input: PerformYaraScanInput) {
  const result = await performYaraScan(input);
  return result;
}
