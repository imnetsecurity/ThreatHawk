import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventTable } from "./components/event-table";
import { SysmonEvent } from "@/lib/types";

export const dynamic = 'force-dynamic';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getEvents(): Promise<SysmonEvent[]> {
  const res = await fetch(`${API_URL}/api/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch event data');
  return res.json();
}

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Explorer</CardTitle>
        <CardDescription>
          Live-tail, search, and analyze Sysmon event streams from all agents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <EventTable events={events} />
        ) : (
          <div className="flex items-center justify-center h-96 border border-dashed rounded-md">
            <p className="text-muted-foreground">No events to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
