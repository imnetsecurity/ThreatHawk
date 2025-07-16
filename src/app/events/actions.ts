"use server";

import type { SysmonEvent } from "@/lib/types";
import type { PerformYaraScanInput } from "@/ai/flows/yara-scan-flow";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AnomalyDetectionResult {
  anomalyDetected: boolean;
  description: string;
  severity: string;
  confidence: string;
  suggestedRule: string;
}

interface RuleGenerationResult {
  success: boolean;
  ruleContent: string;
  description: string;
}

interface YaraScanResult {
  success: boolean;
  detections: Array<any>;
  scanDetails: string;
}

export async function analyzeEventForAnomalies(event: SysmonEvent): Promise<AnomalyDetectionResult> {
  const res = await fetch(`${API_URL}/api/ai/anomaly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sysmonEventData: JSON.stringify(event.event_data, null, 2),
      fileHash: event.process?.hash,
    }),
  });
  if (!res.ok) throw new Error('Failed to analyze event for anomalies');
  return res.json();
}

export async function createRuleFromAnomaly(anomalyDescription: string, event: SysmonEvent): Promise<RuleGenerationResult> {
  const res = await fetch(`${API_URL}/api/ai/generate-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      anomalyDescription,
      relevantSysmonEvents: JSON.stringify(event.event_data, null, 2),
    }),
  });
  if (!res.ok) throw new Error('Failed to create rule from anomaly');
  return res.json();
}

export async function scanWithYara(input: PerformYaraScanInput): Promise<YaraScanResult> {
  const res = await fetch(`${API_URL}/api/ai/yara-scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to perform YARA scan');
  return res.json();
}
