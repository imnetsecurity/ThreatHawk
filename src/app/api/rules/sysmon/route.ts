// src/app/api/rules/sysmon/route.ts

import { NextResponse } from 'next/server';
import { sysmonRules } from '@/lib/mock-data';

export async function GET(request: Request) {
  const rules = sysmonRules;
  return NextResponse.json(rules);
}
