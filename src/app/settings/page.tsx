import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your ThreatHawk settings and API integrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="virustotal-key">VirusTotal API Key</Label>
          <Input
            id="virustotal-key"
            placeholder="Enter your VirusTotal API Key"
            type="password"
          />
          <p className="text-sm text-muted-foreground">
            Your API key is stored securely and used for file hash lookups.
          </p>
        </div>
        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
