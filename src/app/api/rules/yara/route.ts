// src/app/api/rules/yara/route.ts

import { NextResponse } from 'next/server';
import { yaraRules } from '@/lib/mock-data';

export async function GET(request: Request) {
  const rules = yaraRules;
  return NextResponse.json(rules);
}
