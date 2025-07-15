
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  BarChart as BarChartIcon,
  Bell,
  Cpu,
  FileText,
  LineChart,
  ShieldAlert,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { recentAlerts, timelineData } from "@/lib/mock-data";
import { Alert } from "@/lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const chartConfig = {
  informational: {
    label: "Informational",
    color: "hsl(var(--chart-1))",
  },
  warning: {
    label: "Warning",
    color: "hsl(var(--chart-2))",
  },
  critical: {
    label: "Critical",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const router = useRouter();
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

  const cardClasses = "transition-all hover:bg-card/80 hover:shadow-md cursor-pointer";

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/events">
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Events (Last 24h)
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No events recorded
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/alerts">
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No active alerts
              </p>
            </CardContent>
          </Card>
        </Link>
         <Link href="/response">
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agents Online</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 / 0</div>
              <p className="text-xs text-muted-foreground">No agents reporting</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Alerts Timeline (Last 12 Hours)</CardTitle>
            <CardDescription>
              A summary of alert severities over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={timelineData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="informational"
                  fill="var(--color-informational)"
                  radius={4}
                  stackId="a"
                />
                <Bar
                  dataKey="warning"
                  fill="var(--color-warning)"
                  radius={4}
                  stackId="a"
                />
                <Bar
                  dataKey="critical"
                  fill="var(--color-critical)"
                  radius={4}
                  stackId="a"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent High-Severity Alerts</CardTitle>
            <CardDescription>
              Critical and warning alerts that require immediate attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAlerts.map((alert: Alert) => (
                  <TableRow
                    key={alert.id}
                    className="cursor-pointer"
                    onClick={() => router.push("/alerts")}
                  >
                    <TableCell>
                      <Badge variant={getBadgeVariant(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                    <TableCell className="font-medium">
                      {alert.description}
                    </TableCell>
                    <TableCell>{alert.agentHostname}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(alert.status)}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
