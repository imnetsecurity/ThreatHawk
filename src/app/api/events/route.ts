// src/app/api/events/route.ts

import { NextResponse } from 'next/server';
import { EventPayload } from '@/lib/types';
import { sysmonEvents as initialSysmonEvents } from '@/lib/mock-data';

const receivedEvents: EventPayload[] = [];

initialSysmonEvents.forEach(event => {
  receivedEvents.push({ type: "windows_sysmon", data: event });
});

export async function GET(request: Request) {
  return NextResponse.json(receivedEvents);
}

export async function POST(request: Request) {
  try {
    const eventPayload: EventPayload = await request.json();
    console.log(`
--- [Next.js API] Event Received from Agent ---`);
    console.log(JSON.stringify(eventPayload, null, 2));
    receivedEvents.push(eventPayload);
    if (receivedEvents.length > 50) {
      receivedEvents.shift();
    }
    return NextResponse.json({ status: 'success', message: 'Event received and stored' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to process event' }, { status: 500 });
  }
}
