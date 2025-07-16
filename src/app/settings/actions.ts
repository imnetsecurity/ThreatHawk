"use server";

import { AppSettings } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function saveSettings(settings: AppSettings) {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}
