// src/app/settings/components/settings-manager.tsx
"use client";

import { AppSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveSettings } from "../actions";
import { useToast } from "@/hooks/use-toast";

export function SettingsManager({ initialSettings }: { initialSettings: AppSettings }) {
  const { toast } = useToast();

  const handleSave = async () => {
    // In a real app, you would get the updated settings from a form.
    const updatedSettings = initialSettings; 
    
    toast({
      title: "Saving settings...",
      description: "Please wait.",
    });

    try {
      await saveSettings(updatedSettings);
      toast({
        title: "Settings Saved",
        description: "Your new settings have been applied.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Agent Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Download the Sysmon Sentinel Agent for your operating system.
          </p>
          <a href="https://github.com/your-repo/threathawk/releases/latest/download/sysmonsentinel-agent-x86_64-linux" download>
            <Button>Download Agent (Linux x86_64)</Button>
          </a>
          <a href="https://github.com/your-repo/threathawk/releases/latest/download/sysmonsentinel-agent-x86_64.msi" download className="ml-4">
            <Button variant="secondary">Download Agent (Windows x64)</Button>
          </a>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Settings form would go here */}
          <p className="text-muted-foreground">
            Settings management form is a placeholder.
          </p>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
