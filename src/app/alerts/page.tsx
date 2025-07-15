import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AlertsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Triage Center</CardTitle>
        <CardDescription>
          Investigate, prioritize, and manage all security alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Alerts table and triage tools will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
