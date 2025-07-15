"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Bot, X, Loader2, FileWarning, Terminal, ShieldCheck } from "lucide-react";
import type { SysmonEvent } from "@/lib/types";
import { analyzeEventForAnomalies } from "../actions";
import type { DetectBehavioralAnomalyOutput } from "@/ai/flows/behavioral-anomaly-detection";
import { RuleGenerationDialog } from "./rule-generation-dialog";
import { Badge } from "@/components/ui/badge";

export function AnomalyPanel({
  event,
  onClose,
}: {
  event: SysmonEvent | null;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] =
    React.useState<DetectBehavioralAnomalyOutput | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = React.useState(false);

  React.useEffect(() => {
    // Reset analysis when a new event is selected
    setAnalysisResult(null);
  }, [event]);

  const handleAnalyze = async () => {
    if (!event) return;
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeEventForAnomalies(event);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      // You could set an error state here to show in the UI
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="w-1/3 min-w-[400px] p-4 flex items-center justify-center border-l">
        <p className="text-muted-foreground">Select an event to view details</p>
      </div>
    );
  }

  const hasVirusTotalScore =
    analysisResult?.virusTotalScore && analysisResult.virusTotalScore !== "0/0";

  return (
    <>
      <Card className="w-1/3 min-w-[400px] flex flex-col h-[calc(100vh-10rem)]">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>ID: {event.id}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Process Info</h3>
            <p className="text-sm">
              <span className="text-muted-foreground">Name: </span>
              {event.process.name}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">PID: </span>
              {event.process.pid}
            </p>
            <p className="text-sm font-mono break-all">
              <span className="text-muted-foreground font-sans">
                Command Line:{" "}
              </span>
              {event.process.commandLine}
            </p>
            {event.parentProcess && (
              <p className="text-sm">
                <span className="text-muted-foreground">Parent: </span>
                {event.parentProcess.name} ({event.parentProcess.pid})
              </p>
            )}
             {event.process.hash && (
              <p className="text-sm font-mono break-all">
                <span className="text-muted-foreground font-sans">
                  SHA256:{" "}
                </span>
                {event.process.hash}
              </p>
            )}
          </div>
          <Separator />
          {analysisResult && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> AI Analysis
              </h3>
              {hasVirusTotalScore && (
                <div className="mb-4">
                   <Alert variant="destructive">
                     <ShieldCheck className="h-4 w-4" />
                     <AlertTitle>VirusTotal Match!</AlertTitle>
                     <AlertDescription>
                       This file is known to be malicious. Score:{" "}
                       <Badge variant="destructive">{analysisResult.virusTotalScore}</Badge>
                     </AlertDescription>
                   </Alert>
                </div>
              )}
              <Alert
                variant={analysisResult.isAnomalous ? "destructive" : "default"}
              >
                <FileWarning className="h-4 w-4" />
                <AlertTitle>
                  {analysisResult.isAnomalous
                    ? "Anomaly Detected!"
                    : "Behavior Appears Normal"}
                </AlertTitle>
                <AlertDescription>
                  {analysisResult.explanation}
                </AlertDescription>
              </Alert>
              {analysisResult.isAnomalous && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> Suggested Action
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The AI has identified this event as anomalous. You can use
                    the AI to generate a Sysmon rule to detect this behavior in
                    the future.
                  </p>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => setIsRuleDialogOpen(true)}
                  >
                    Generate & Deploy Rule
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !event.process.hash}
            className="w-full"
            title={!event.process.hash ? "Event must have a file hash for analysis" : "Analyze for anomalies"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Analyze for Anomalies
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      {analysisResult && event && (
        <RuleGenerationDialog
          isOpen={isRuleDialogOpen}
          setIsOpen={setIsRuleDialogOpen}
          anomalyDescription={analysisResult.explanation}
          event={event}
        />
      )}
    </>
  );
}
