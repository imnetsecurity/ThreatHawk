"use server";

import { detectBehavioralAnomaly } from "@/ai/flows/behavioral-anomaly-detection";
import type { SysmonEvent } from "@/lib/types";

export async function analyzeEventForAnomalies(event: SysmonEvent) {
  const result = await detectBehavioralAnomaly({
    sysmonEventData: JSON.stringify(event.fullData, null, 2),
  });
  return result;
}
