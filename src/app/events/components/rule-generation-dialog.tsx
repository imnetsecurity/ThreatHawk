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
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { GenerateSysmonRuleOutput } from "@/ai/flows/ai-rule-generation";
import type { SysmonEvent } from "@/lib/types";
import { createRuleFromAnomaly } from "../actions";
import { useToast } from "@/hooks/use-toast";

export function RuleGenerationDialog({
  isOpen,
  setIsOpen,
  anomalyDescription,
  event,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  anomalyDescription: string;
  event: SysmonEvent;
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [ruleResult, setRuleResult] =
    React.useState<GenerateSysmonRuleOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setRuleResult(null);
      createRuleFromAnomaly(anomalyDescription, event)
        .then((result) => setRuleResult(result))
        .catch((err) => {
          console.error("Rule generation failed:", err);
          setError("Failed to generate the Sysmon rule. Please try again.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, anomalyDescription, event]);

  const handleCopy = () => {
    if (!ruleResult) return;
    navigator.clipboard.writeText(ruleResult.suggestedRuleXml);
    setHasCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the Sysmon rule into your configuration.",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Generated Sysmon Rule
          </DialogTitle>
          <DialogDescription>
            The AI has analyzed the anomaly and generated the following Sysmon
            rule to detect similar behavior.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {ruleResult && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Rule Name</h3>
              <p className="text-sm text-muted-foreground">
                {ruleResult.suggestedRuleName}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI Rationale</h3>
              <p className="text-sm text-muted-foreground">
                {ruleResult.rationale}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Confidence Score</h3>
              <Badge>
                {(ruleResult.confidenceScore * 100).toFixed(0)}% Confidence
              </Badge>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">Suggested Rule (XML)</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {hasCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">{hasCopied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <div className="bg-black/80 p-3 rounded-md max-h-64 overflow-y-auto">
                <pre className="text-xs text-white whitespace-pre-wrap font-mono">
                  <code>{ruleResult.suggestedRuleXml}</code>
                </pre>
              </div>
            </div>
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
