
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { generateRuleFromText } from "../../actions";
import { useToast } from "@/hooks/use-toast";
import type { GenerateSysmonRuleFromTextOutput } from "@/ai/flows/ai-rule-from-text";

export function AiGenerator({ onRuleGenerated }: { onRuleGenerated: (ruleXml: string) => void }) {
  const [prompt, setPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<GenerateSysmonRuleFromTextOutput | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResult(null);
    try {
      const genResult = await generateRuleFromText(prompt);
      setResult(genResult);
      onRuleGenerated(genResult.ruleXml);
    } catch (error) {
      console.error("Rule generation from text failed:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI could not generate a rule from your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.ruleXml) return;
    navigator.clipboard.writeText(result.ruleXml);
    setHasCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the Sysmon rule into your configuration.",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };


  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-1">
        <CardTitle className="flex items-center gap-2">
          AI-Powered Rule Creation
        </CardTitle>
        <CardDescription>
          Describe the behavior you want to detect in plain English, and the AI
          will generate a Sysmon rule for you. For example: "Detect when PowerShell starts a process and that process makes a network connection."
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-1">
        <Textarea
          placeholder="Describe the rule you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Rule
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold mb-1">AI Explanation</h3>
              <p className="text-sm text-muted-foreground">{result.explanation}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">Generated Rule (XML)</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!result.ruleXml}>
                    {hasCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">{hasCopied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </div>
              <div className="bg-black/80 p-3 rounded-md max-h-64 overflow-y-auto">
                <pre className="text-xs text-white whitespace-pre-wrap font-mono">
                  <code>{result.ruleXml}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

