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
        <EventTable events={sysmonEvents} />
      </CardContent>
    </Card>
  );
}
