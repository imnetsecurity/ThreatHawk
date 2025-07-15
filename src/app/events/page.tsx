import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventTable } from "./components/event-table";
import { sysmonEvents } from "@/lib/mock-data";

export default function EventsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Explorer</CardTitle>
        <CardDescription>
          Live-tail, search, and analyze Sysmon event streams from all agents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sysmonEvents.length > 0 ? (
          <EventTable events={sysmonEvents} />
        ) : (
          <div className="flex items-center justify-center h-96 border border-dashed rounded-md">
            <p className="text-muted-foreground">No events to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
