// src/app/api/dashboard/metrics/route.ts

import { NextResponse } from 'next/server';
// In a real app, these would come from a database or aggregation service
import { sysmonEvents, recentAlerts } from '@/lib/mock-data'; 

export async function GET(request: Request) {
  // Simulate fetching real-time metrics
  const metrics = {
    eventsLast24h: sysmonEvents.length,
    activeAlerts: recentAlerts.filter(alert => alert.status === "New").length,
    // Resetting agent counts for the development environment as requested.
    agentsOnline: 0, 
    totalAgents: 0,
  };

  return NextResponse.json(metrics);
}
