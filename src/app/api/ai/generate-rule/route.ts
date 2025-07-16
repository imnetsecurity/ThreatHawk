// src/app/api/ai/generate-rule/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { anomalyDescription, relevantSysmonEvents } = await request.json();

  console.log("Mock AI: Generating Sysmon rule from anomaly...");
  console.log("Anomaly Description:", anomalyDescription);
  console.log("Relevant Sysmon Events:", relevantSysmonEvents);

  // Simulate an AI response
  const mockResponse = {
    success: true,
    ruleContent: `<Sysmon schemaversion="4.90">
  <EventFiltering>
    <RuleGroup name="GeneratedRule_${Date.now()}" groupRelation="or">
      <ProcessCreate onmatch="exclude">
        <Image condition="contains">${anomalyDescription.split(' ')[0] || "malicious"}.exe</Image>
      </ProcessCreate>
    </RuleGroup>
  </EventFiltering>
</Sysmon>`,
    description: "Generated a placeholder Sysmon rule based on the anomaly.",
  };

  return NextResponse.json(mockResponse);
}
