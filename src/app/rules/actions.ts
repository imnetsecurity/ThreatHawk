
"use server";

import { generateSysmonRuleFromText } from "@/ai/flows/ai-rule-from-text";

export async function generateRuleFromText(prompt: string) {
  const result = await generateSysmonRuleFromText({
    request: prompt,
  });
  return result;
}
