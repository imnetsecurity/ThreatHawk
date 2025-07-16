// src/app/api/settings/route.ts

import { NextResponse } from 'next/server';
import { AppSettings } from '@/lib/types';

export async function POST(request: Request) {
  const settings: AppSettings = await request.json();
  console.log('--- Settings Received by Mock Server ---');
  console.log(JSON.stringify(settings, null, 2));
  console.log('--------------------------------------');
  return NextResponse.json({ status: 'success', message: 'Settings saved successfully (mock)', receivedSettings: settings });
}
