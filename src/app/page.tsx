// src/app/page.tsx

import { DashboardClient } from "@/components/dashboard-client";
import type { Alert, TimelineDataPoint } from "@/lib/types";

export const dynamic = 'force-dynamic';

interface Metrics {
  eventsLast24h: number;
  activeAlerts: number;
  agentsOnline: number;
  totalAgents: number;
}

// --- Data Fetching Functions ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getMetrics(): Promise<Metrics> {
  const res = await fetch(`${API_URL}/api/dashboard/metrics`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}

async function getTimelineData(): Promise<TimelineDataPoint[]> {
  const res = await fetch(`${API_URL}/api/dashboard/timeline`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch timeline data');
  return res.json();
}

async function getRecentHighSeverityAlerts(): Promise<Alert[]> {
  const res = await fetch(`${API_URL}/api/alerts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch recent alerts');
  const allAlerts: Alert[] = await res.json();
  return allAlerts.filter(alert => ["Critical", "High", "Warning"].includes(alert.severity));
}

// --- The Server Component ---
export default async function DashboardPage() {
  const [metrics, timeline, recentHighSeverityAlerts] = await Promise.all([
    getMetrics(),
    getTimelineData(),
    getRecentHighSeverityAlerts(),
  ]);

  return (
    <DashboardClient
      metrics={metrics}
      timeline={timeline}
      recentHighSeverityAlerts={recentHighSeverityAlerts}
    />
  );
}
