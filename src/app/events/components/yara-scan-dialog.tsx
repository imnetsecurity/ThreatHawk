
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Scan, FileText, ShieldCheck, ShieldOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { yaraRules } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { scanWithYara } from "../actions";
import type { PerformYaraScanOutput } from "@/ai/flows/yara-scan-flow";

export function YaraScanDialog({
  isOpen,
  setIsOpen,
  fileHash,
  agentHostname,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fileHash: string;
  agentHostname: string;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRuleId, setSelectedRuleId] = React.useState<string>("");
  const [scanResult, setScanResult] =
    React.useState<PerformYaraScanOutput | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    const selectedRule = yaraRules.find((r) => r.id === selectedRuleId);
    if (!selectedRule) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: "Please select a YARA rule to scan with.",
      });
      return;
    }

    setIsLoading(true);
    setScanResult(null);

    try {
      const result = await scanWithYara({
        fileHash,
        yaraRule: selectedRule.content,
      });
      setScanResult(result);
    } catch (error) {
      console.error("YARA scan failed:", error);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "The AI could not complete the YARA scan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setScanResult(null);
      setSelectedRuleId("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            Initiate YARA Scan
          </DialogTitle>
          <DialogDescription>
            Scan file <strong>{fileHash.substring(0, 12)}...</strong> on agent{" "}
            <strong>{agentHostname}</strong> with a selected YARA rule.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedRuleId} onValueChange={setSelectedRuleId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a YARA rule file..." />
              </SelectTrigger>
              <SelectContent>
                {yaraRules.map((rule) => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleScan}
            disabled={isLoading || !selectedRuleId}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Scan className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Scanning..." : "Start Scan"}
          </Button>
        </div>

        {scanResult && (
          <div>
            <h3 className="font-semibold mb-2">Scan Result</h3>
            <Alert variant={scanResult.didMatch ? "destructive" : "default"}>
              {scanResult.didMatch ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )}
              <AlertTitle>
                {scanResult.didMatch ? "YARA Rule Matched!" : "No Match Found"}
              </AlertTitle>
              <AlertDescription>
                {scanResult.didMatch
                  ? `Rule '${scanResult.matchedRuleName}' matched. Details: ${scanResult.matchDetails}`
                  : "The selected YARA rule did not match the target file."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
