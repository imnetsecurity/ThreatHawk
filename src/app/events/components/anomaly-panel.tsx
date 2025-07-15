
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
import { Bot, X, Loader2, FileWarning, Terminal, ShieldCheck, Scan } from "lucide-react";
import type { SysmonEvent } from "@/lib/types";
import { analyzeEventForAnomalies } from "../actions";
import type { DetectBehavioralAnomalyOutput } from "@/ai/flows/behavioral-anomaly-detection";
import { RuleGenerationDialog } from "./rule-generation-dialog";
import { YaraScanDialog } from "./yara-scan-dialog";
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
  const [isYaraDialogOpen, setIsYaraDialogOpen] = React.useState(false);
  const hasFileHash = !!event?.process.hash;

  React.useEffect(() => {
    setAnalysisResult(null);

    if (event) {
      const handleAnalyze = async () => {
        setIsLoading(true);
        try {
          const result = await analyzeEventForAnomalies(event);
          setAnalysisResult(result);
        } catch (error) {
          console.error("Analysis failed:", error);
        } finally {
          setIsLoading(false);
        }
      };
      handleAnalyze();
    }
  }, [event]);


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
            {event.parentProcess && (
              <p className="text-sm">
                <span className="text-muted-foreground">Parent: </span>
                {event.parentProcess.name} ({event.parentProcess.pid})
              </p>
            )}
            <p className="text-sm font-mono break-all">
              <span className="text-muted-foreground font-sans">
                Command Line:{" "}
              </span>
              {event.process.commandLine}
            </p>
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
          <div>
            <h3 className="font-semibold mb-2">Actions</h3>
             <Button
                variant="outline"
                disabled={!hasFileHash}
                onClick={() => setIsYaraDialogOpen(true)}
                title={!hasFileHash ? "Event must have a file hash to scan" : "Initiate YARA Scan"}
              >
                <Scan className="mr-2 h-4 w-4" />
                YARA Scan
              </Button>
          </div>
          {(isLoading || analysisResult) && (
            <div>
              <Separator className="my-4"/>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> AI Analysis
              </h3>
              {isLoading && (
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Analyzing with AI...</span>
                 </div>
              )}
              {analysisResult && (
                <div className="space-y-4 mt-2">
                  {hasVirusTotalScore && (
                    <Alert variant="destructive">
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>VirusTotal Match!</AlertTitle>
                      <AlertDescription>
                        This file is known to be malicious. Score:{" "}
                        <Badge variant="destructive">{analysisResult.virusTotalScore}</Badge>
                      </AlertDescription>
                    </Alert>
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
                    <div>
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
            </div>
          )}
        </CardContent>
        <CardFooter>
            {/* Footer can be used for other actions later */}
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
       {event && hasFileHash && (
        <YaraScanDialog
          isOpen={isYaraDialogOpen}
          setIsOpen={setIsYaraDialogOpen}
          fileHash={event.process.hash!}
          agentHostname={event.agent.hostname}
        />
      )}
    </>
  );
}
