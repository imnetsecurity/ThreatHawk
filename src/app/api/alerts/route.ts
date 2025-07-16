// src/app/api/alerts/route.ts

import { NextResponse } from 'next/server';
// Correcting the import name from 'alerts' to 'recentAlerts'
import { recentAlerts } from '@/lib/mock-data'; 

// This function will handle GET requests to /api/alerts
export async function GET(request: Request) {
  // In a real application, this is where you would fetch alert data
  // from your backend or database.
  
  // Now using the correctly named variable
  const liveAlerts = recentAlerts;

  // We use NextResponse to send a JSON response with a 200 OK status.
  return NextResponse.json(liveAlerts);
}
