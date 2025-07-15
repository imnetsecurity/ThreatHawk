"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { SysmonEvent } from "@/lib/types";
import { AnomalyPanel } from "./anomaly-panel";

export function EventTable({ events }: { events: SysmonEvent[] }) {
  const [filter, setFilter] = React.useState("");
  const [selectedEvent, setSelectedEvent] = React.useState<SysmonEvent | null>(
    null
  );

  const filteredEvents = events.filter((event) =>
    JSON.stringify(event).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="mb-4">
          <Input
            placeholder="Filter events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Process</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-mono text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{event.agent.hostname}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.event.name}</Badge>
                  </TableCell>
                  <TableCell>{event.process.name}</TableCell>
                  <TableCell className="truncate max-w-xs">
                    {event.process.commandLine}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AnomalyPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
