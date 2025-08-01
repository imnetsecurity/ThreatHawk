
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
import { Loader2, Sparkles, Copy, Check, Save } from "lucide-react";
import { generateRuleFromText, appendRuleToConfig } from "../actions";
import { useToast } from "@/hooks/use-toast";

export function AiRuleCreator({ currentConfig, onRuleAppend }: { currentConfig: string, onRuleAppend: (newConfig: string) => void}) {
  const [prompt, setPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAppending, setIsAppending] = React.useState(false);
  const [generatedRule, setGeneratedRule] = React.useState("");
  const [explanation, setExplanation] = React.useState("");
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedRule("");
    setExplanation("");
    try {
      const result = await generateRuleFromText(prompt);
      setGeneratedRule(result.ruleXml);
      setExplanation(result.explanation);
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
    if (!generatedRule) return;
    navigator.clipboard.writeText(generatedRule);
    setHasCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the Sysmon rule into your configuration.",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleAppend = async () => {
    if (!generatedRule) return;
    setIsAppending(true);
    try {
        const updatedConfig = await appendRuleToConfig(currentConfig, generatedRule);
        onRuleAppend(updatedConfig);
        setGeneratedRule("");
        setExplanation("");
        setPrompt("");
        toast({
            title: "Rule Appended!",
            description: "The new rule has been added to the configuration editor above."
        });
    } catch (error: any) {
        console.error("Failed to append rule:", error);
        toast({
            variant: "destructive",
            title: "Append Failed",
            description: error.message || "Could not append the rule to the configuration."
        });
    } finally {
        setIsAppending(false);
    }
  }


  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Rule Creation
        </CardTitle>
        <CardDescription>
          Describe the behavior you want to detect in plain English, and the AI
          will generate a Sysmon rule for you. For example: "Detect when PowerShell starts a process and that process makes a network connection."
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the rule you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Rule
        </Button>

        {generatedRule && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">AI Explanation</h3>
              <p className="text-sm text-muted-foreground">{explanation}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">Generated Rule (XML)</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!generatedRule}>
                    {hasCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">{hasCopied ? "Copied!" : "Copy"}</span>
                  </Button>
                  <Button size="sm" onClick={handleAppend} disabled={isAppending || !generatedRule}>
                      {isAppending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <Save className="mr-2 h-4 w-4" />
                      )}
                      Save & Append to Config
                  </Button>
                </div>
              </div>
              <div className="bg-black/80 p-3 rounded-md max-h-64 overflow-y-auto">
                <pre className="text-xs text-white whitespace-pre-wrap font-mono">
                  <code>{generatedRule}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
