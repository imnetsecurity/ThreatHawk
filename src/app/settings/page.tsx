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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveSettings } from "./actions";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [apiKey, setApiKey] = React.useState("");
  const [model, setModel] = React.useState("googleai/gemini-1.5-flash-latest");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveSettings({ virusTotalApiKey: apiKey, genkitModel: model });
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully. Changes may require an app restart to take effect.",
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
            Used for file hash lookups in the Event Explorer.
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="model-select">AI Language Model</Label>
          <Select
            value={model}
            onValueChange={setModel}
            disabled={isLoading}
          >
            <SelectTrigger id="model-select" className="w-full sm:w-[350px]">
              <SelectValue placeholder="Select an AI model..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="googleai/gemini-1.5-flash-latest">
                Gemini 1.5 Flash (Latest)
              </SelectItem>
              <SelectItem value="googleai/gemini-1.5-pro-latest">
                Gemini 1.5 Pro (Latest)
              </SelectItem>
              <SelectItem value="googleai/gemini-1.0-pro">
                Gemini 1.0 Pro
              </SelectItem>
            </SelectContent>
          </Select>
           <p className="text-sm text-muted-foreground">
            Select the model used for all AI analysis and generation tasks.
          </p>
        </div>

        <Button onClick={handleSave} disabled={isLoading || !apiKey}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Settings
        </Button>
      </CardContent>
    </Card>
  );
}
