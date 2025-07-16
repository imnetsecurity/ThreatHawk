// src/app/api/dashboard/timeline/route.ts

import { NextResponse } from 'next/server';
import { timelineData } from '@/lib/mock-data'; // Assuming timeline data is in mock-data.ts

// This function will handle GET requests to /api/dashboard/timeline
export async function GET(request: Request) {
  // In a real application, this would fetch aggregated alert data
  // from your backend for the timeline chart.
  
  // For now, we'll just return the mock timeline data.
  return NextResponse.json(timelineData);
}
