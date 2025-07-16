// src/app/api/ai/anomaly/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { sysmonEventData, fileHash } = await request.json();

  console.log("Mock AI: Analyzing event for anomalies...");
  console.log("Event Data:", sysmonEventData);
  console.log("File Hash:", fileHash);

  // Simulate an AI response
  const mockResponse = {
    anomalyDetected: Math.random() > 0.5, // Randomly detect an anomaly
    description: "Simulated anomaly detection based on process behavior.",
    severity: "Medium",
    confidence: "High",
    suggestedRule: "New Sysmon rule to detect unusual process spawns.",
  };

  return NextResponse.json(mockResponse);
}
