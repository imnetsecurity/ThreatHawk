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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TriangleAlert } from "lucide-react";
import type { Alert } from "@/lib/types";
import { cn } from "@/lib/utils";

const getBadgeVariant = (
  severity: "Critical" | "Warning" | "Informational"
) => {
  switch (severity) {
    case "Critical":
      return "destructive";
    case "Warning":
      return "secondary";
    default:
      return "default";
  }
};

const getStatusBadgeVariant = (
  status: "New" | "Acknowledged" | "Escalated" | "Closed"
) => {
  switch (status) {
    case "New":
      return "destructive";
    case "Acknowledged":
      return "default";
    case "Escalated":
      return "secondary";
    case "Closed":
      return "outline";
  }
};


export function AlertsTable({ alerts, onStatusChange }: { alerts: Alert[], onStatusChange: (alertId: string, newStatus: Alert["status"]) => void }) {
  const getRowClass = (severity: Alert['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-destructive/10 hover:bg-destructive/20';
      case 'Warning':
        return 'bg-secondary/40 hover:bg-secondary/60';
      default:
        return '';
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Severity</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id} className={cn(getRowClass(alert.severity))}>
              <TableCell>
                <Badge variant={getBadgeVariant(alert.severity)}>
                  <TriangleAlert className="mr-1 h-3 w-3" />
                  {alert.severity}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{alert.timestamp}</TableCell>
              <TableCell className="font-medium">{alert.description}</TableCell>
              <TableCell>{alert.agentHostname}</TableCell>
               <TableCell>
                <Badge variant="outline">{alert.source}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(alert.status)}>{alert.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onStatusChange(alert.id, "Acknowledged")}
                    >
                      Acknowledge
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(alert.id, "Escalated")}
                    >
                      Escalate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(alert.id, "Closed")}
                    >
                      Close as False Positive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
