
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateYaraXRule } from '../actions';

interface AiGeneratorProps {
    onRuleGenerated: (rule: string) => void;
}

export function AiGenerator({ onRuleGenerated }: AiGeneratorProps) {
    const [prompt, setPrompt] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        try {
            const result = await generateYaraXRule(prompt);
            onRuleGenerated(result);
        } catch (error) {
            console.error("YARA-X rule generation failed:", error);
            toast({
                variant: "destructive",
                title: "AI Generation Failed",
                description: "The AI could not generate a rule from your request. Please check your AI provider settings.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Generate with AI</CardTitle>
                <CardDescription>
                    Describe the rule you want to create in plain English. The AI will attempt to generate a YARA-X rule based on your description.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    placeholder="e.g., a rule to find files that import 'kernel32.dll' and contain the string 'CreateRemoteThread'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                />
                <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Rule
                </Button>
            </CardContent>
        </Card>
    );
}
