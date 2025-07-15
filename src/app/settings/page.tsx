
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
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveSettings } from "./actions";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [apiKey, setApiKey] = React.useState("");
  const [provider, setProvider] = React.useState<'google' | 'ollama'>("google");
  
  const [googleModel, setGoogleModel] = React.useState("googleai/gemini-1.5-flash-latest");
  const [ollamaHost, setOllamaHost] = React.useState("http://127.0.0.1:11434");
  const [ollamaModel, setOllamaModel] = React.useState("");
  
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveSettings({ 
        virusTotalApiKey: apiKey, 
        genkitProvider: provider,
        googleModel: googleModel,
        ollamaHost: ollamaHost,
        ollamaModel: ollamaModel,
      });
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

        <div className="space-y-4">
            <div className="space-y-2">
                <Label>AI Provider</Label>
                 <p className="text-sm text-muted-foreground">
                    Select the AI provider for all analysis and generation tasks.
                  </p>
                <Select
                    value={provider}
                    onValueChange={(value) => setProvider(value as 'google' | 'ollama')}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-full sm:w-[350px]">
                    <SelectValue placeholder="Select an AI provider..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="google">
                        Google AI (Cloud)
                        </SelectItem>
                        <SelectItem value="ollama">
                        Ollama (On-Premise)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

          {provider === 'google' && (
             <div className="space-y-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="model-select">Google AI Model</Label>
                <Select
                    value={googleModel}
                    onValueChange={setGoogleModel}
                    disabled={isLoading}
                >
                    <SelectTrigger id="model-select" className="w-full sm:w-[350px]">
                    <SelectValue placeholder="Select a Google AI model..." />
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
          )}

          {provider === 'ollama' && (
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                    <Label htmlFor="ollama-host">Ollama Host URL</Label>
                    <Input
                        id="ollama-host"
                        placeholder="e.g., http://127.0.0.1:11434"
                        value={ollamaHost}
                        onChange={(e) => setOllamaHost(e.target.value)}
                        disabled={isLoading}
                    />
                     <p className="text-sm text-muted-foreground">
                        The full URL of your Ollama API endpoint.
                    </p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="ollama-model">Ollama Model Name</Label>
                    <Input
                        id="ollama-model"
                        placeholder="e.g., llama3, gemma"
                        value={ollamaModel}
                        onChange={(e) => setOllamaModel(e.target.value)}
                        disabled={isLoading}
                    />
                     <p className="text-sm text-muted-foreground">
                       The exact name of the model you have downloaded in Ollama.
                    </p>
                </div>
              </div>
          )}

        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Settings
        </Button>
      </CardContent>
    </Card>
  );
}
