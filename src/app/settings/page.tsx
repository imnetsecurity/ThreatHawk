"use client";

import * as React from "react";
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
import { useToast } from "@/hooks/use-toast";
import { saveSettings } from "./actions";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveSettings({ virusTotalApiKey: apiKey });
      toast({
        title: "Settings Saved",
        description: "Your VirusTotal API key has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Your API key is stored securely in your project's .env file and used for file hash lookups.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading || !apiKey}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
