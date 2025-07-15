
"use server";

import { generateYaraXRuleFromText } from "@/ai/flows/yara-x-rule-generation";

export async function generateYaraXRule(prompt: string): Promise<string> {
  const result = await generateYaraXRuleFromText(prompt);
  return result;
}
