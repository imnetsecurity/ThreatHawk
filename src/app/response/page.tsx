import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResponsePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remote Response</CardTitle>
        <CardDescription>
          Execute commands and scripts on remote agents via a secure gateway.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Secure PowerShell Gateway terminal will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
