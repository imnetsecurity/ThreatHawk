
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Scan, FileText, ShieldCheck, ShieldOff, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { yaraRules } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { scanWithYara } from "../actions";
import type { PerformYaraScanOutput } from "@/ai/flows/yara-scan-flow";
import { Textarea } from "@/components/ui/textarea";

export function YaraScanDialog({
  isOpen,
  setIsOpen,
  initialFileHash = "",
  initialRuleId = "",
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialFileHash?: string;
  initialRuleId?: string;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [fileHash, setFileHash] = React.useState(initialFileHash);
  const [selectedRuleId, setSelectedRuleId] = React.useState(initialRuleId);
  const [ruleContent, setRuleContent] = React.useState("");
  const [scanResult, setScanResult] =
    React.useState<PerformYaraScanOutput | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!ruleContent) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: "Please select or provide a YARA rule to scan with.",
      });
      return;
    }
     if (!fileHash) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: "Please provide a file hash to scan.",
      });
      return;
    }

    setIsLoading(true);
    setScanResult(null);

    try {
      const result = await scanWithYara({
        fileHash,
        yaraRule: ruleContent,
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
  
  // Effect to update content when a predefined rule is selected
  React.useEffect(() => {
    const selectedRule = yaraRules.find((r) => r.id === selectedRuleId);
    setRuleContent(selectedRule?.content || "");
  }, [selectedRuleId]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setScanResult(null);
      setSelectedRuleId(initialRuleId);
      setFileHash(initialFileHash);
      
      const initialRule = yaraRules.find(r => r.id === initialRuleId);
      setRuleContent(initialRule?.content || "");
    }
  }, [isOpen, initialRuleId, initialFileHash]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            Initiate Simulated YARA Scan
          </DialogTitle>
          <DialogDescription>
            Test a YARA rule against a file hash. The AI will simulate the scan result.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="file-hash">File Hash (SHA256)</Label>
                    <Input
                        id="file-hash"
                        placeholder="Enter the file hash to scan..."
                        value={fileHash}
                        onChange={(e) => setFileHash(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="yara-rule">Load Rule From File</Label>
                    <Select value={selectedRuleId} onValueChange={setSelectedRuleId} disabled={isLoading}>
                      <SelectTrigger id="yara-rule" className="w-full">
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
                    disabled={isLoading || !ruleContent || !fileHash}
                    className="w-full"
                >
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Scan className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? "Scanning..." : "Start Scan"}
                </Button>
                 {scanResult && (
                    <div className="pt-4">
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
            </div>
            <div className="space-y-2">
                 <Label>Rule Content</Label>
                 <Textarea 
                    className="h-[350px] font-mono bg-black/80 text-white text-xs"
                    value={ruleContent}
                    onChange={(e) => setRuleContent(e.target.value)}
                    placeholder="Select a rule or paste your own content here to begin."
                    disabled={isLoading}
                 />
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
