
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CliBuilder() {
    const [scanPath, setScanPath] = React.useState("/path/to/scan");
    const [rulePath, setRulePath] = React.useState("generated_rule.yar");
    const [threads, setThreads] = React.useState(4);
    const [printStrings, setPrintStrings] = React.useState(true);
    const [printNamespace, setPrintNamespace] = React.useState(true);

    const [command, setCommand] = React.useState("");
    const [hasCopied, setHasCopied] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        let cmd = `yr scan `;
        if (threads) cmd += `--threads ${threads} `;
        if (printStrings) cmd += `-s `;
        if (printNamespace) cmd += `-n `;
        cmd += `${rulePath} ${scanPath}`;
        setCommand(cmd);
    }, [scanPath, rulePath, threads, printStrings, printNamespace]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(command);
        setHasCopied(true);
        toast({ title: "Command copied to clipboard!" });
        setTimeout(() => setHasCopied(false), 2000);
      };

    return (
        <Card className="border-none shadow-none">
             <CardHeader>
                <CardTitle>CLI Command Builder</CardTitle>
                <CardDescription>
                    Construct a `yr scan` command to test your generated rule locally.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rule-path">Rule File Path</Label>
                        <Input id="rule-path" value={rulePath} onChange={e => setRulePath(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scan-path">Target Path</Label>
                        <Input id="scan-path" value={scanPath} onChange={e => setScanPath(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="threads">Threads</Label>
                        <Input id="threads" type="number" value={threads} onChange={e => setThreads(parseInt(e.target.value,10) || 1)} />
                    </div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="print-strings" checked={printStrings} onCheckedChange={c => setPrintStrings(!!c)} />
                        <Label htmlFor="print-strings">Print strings (-s)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="print-namespace" checked={printNamespace} onCheckedChange={c => setPrintNamespace(!!c)} />
                        <Label htmlFor="print-namespace">Print namespace (-n)</Label>
                    </div>
                </div>
                <div className="space-y-2 pt-4">
                    <Label>Generated Command</Label>
                    <div className="flex gap-2">
                        <Input value={command} readOnly className="font-mono" />
                        <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                             {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
