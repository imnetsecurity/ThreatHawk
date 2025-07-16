// src/app/api/ai/generate-yara-rule/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  console.log("Mock AI: Generating YARA-X rule...");
  console.log("Prompt:", prompt);

  // Simulate YARA-X rule generation
  const mockRuleContent = `rule generated_rule_${Date.now()} {
  meta:
    author = "ThreatHawk AI (Mock)"
    description = "Generated based on prompt: ${prompt.substring(0, 50)}..."
  strings:
    $s1 = "${prompt.split(' ')[0] || "malicious"}"
    $s2 = "another_indicator"
  condition:
    $s1 or $s2
}
`;

  return NextResponse.json({ ruleContent: mockRuleContent });
}
