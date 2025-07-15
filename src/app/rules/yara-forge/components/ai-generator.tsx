
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiGeneratorProps {
    onRuleGenerated: (rule: string) => void;
}

export function AiGenerator({ onRuleGenerated }: AiGeneratorProps) {
    const [prompt, setPrompt] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        // Placeholder for actual AI call
        setTimeout(() => {
             toast({
                variant: "destructive",
                title: "AI Not Implemented",
                description: "AI rule generation is not yet connected.",
            });
            // Example output:
            // onRuleGenerated('rule example_from_ai { meta: author = "AI" strings: $a = "example" condition: $a }');
            setIsLoading(false);
        }, 1500);
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
