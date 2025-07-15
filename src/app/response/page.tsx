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
import { Input } from "@/components/ui/input";
import { ChevronRight, HardDrive, Loader2, Power, PowerOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sysmonEvents } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type TerminalLine = {
  type: "command" | "output" | "system";
  content: string;
};

export default function ResponsePage() {
  // Get unique hostnames from mock data
  const agents = [
    ...new Map(
      sysmonEvents.map((item) => [item.agent.hostname, item.agent])
    ).values(),
  ];

  const [selectedAgent, setSelectedAgent] = React.useState<string>("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [command, setCommand] = React.useState("");
  const [history, setHistory] = React.useState<TerminalLine[]>([
    { type: "system", content: "ThreatHawk PowerShell Gateway v1.0" },
    { type: "system", content: "Please select an agent and click 'Connect'." },
  ]);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    // Scroll to the bottom of the terminal on new output
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleConnect = () => {
    if (!selectedAgent) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Please select an agent first.",
      });
      return;
    }
    setIsConnecting(true);
    setHistory((prev) => [
      ...prev,
      { type: "system", content: `Connecting to ${selectedAgent}...` },
    ]);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setHistory((prev) => [
        ...prev,
        { type: "system", content: "Connection successful." },
      ]);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setHistory((prev) => [
      ...prev,
      { type: "system", content: `Disconnected from ${selectedAgent}.` },
    ]);
  };

  const handleExecute = () => {
    if (!command) return;
    const newHistory: TerminalLine[] = [
      ...history,
      { type: "command", content: command },
    ];
    // Mocked responses
    if (command.toLowerCase().includes("get-process")) {
      newHistory.push({
        type: "output",
        content: `
Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    850      55    98140     145820      23.50   4567   1 winword
    430      32    45120      89421      11.10   1234   1 powershell
`,
      });
    } else if (command.toLowerCase() === "whoami") {
      newHistory.push({
        type: "output",
        content: "corp\\th-admin",
      });
    } else {
        newHistory.push({
        type: "output",
        content: `Command '${command}' executed successfully. No output returned.`,
        });
    }

    setHistory(newHistory);
    setCommand("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure PowerShell Gateway</CardTitle>
        <CardDescription>
          Execute commands and scripts on remote agents via a secure, audited
          gateway.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <label htmlFor="agent-select" className="font-medium">
              Target Agent:
            </label>
          </div>
          <Select
            value={selectedAgent}
            onValueChange={setSelectedAgent}
            disabled={isConnected || isConnecting}
          >
            <SelectTrigger id="agent-select" className="w-full sm:w-[350px]">
              <SelectValue placeholder="Select an agent to connect to..." />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.hostname}>
                  {agent.hostname} ({agent.ip})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isConnected ? (
            <Button variant="destructive" onClick={handleDisconnect}>
              <PowerOff /> Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Power />
              )}
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>

        <div
          ref={terminalRef}
          className="font-mono text-sm bg-black rounded-lg p-4 h-[500px] overflow-y-auto text-white space-y-2"
        >
          {history.map((line, index) => (
            <div key={index}>
              {line.type === "command" && (
                <>
                  <span className="text-cyan-400">
                    PS C:\Users\th-admin&gt;
                  </span>{" "}
                  <span className="text-white">{line.content}</span>
                </>
              )}
              {line.type === "output" && (
                <pre className="whitespace-pre-wrap text-lime-300">
                  {line.content}
                </pre>
              )}
              {line.type === "system" && (
                <p className="text-yellow-400">
                  {line.content}
                </p>
              )}
            </div>
          ))}
          {isConnected && (
             <div>
                 <span className="text-cyan-400">
                    PS C:\Users\th-admin&gt;
                 </span>{" "}
            </div>
          )}
        </div>

        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleExecute();
            }}
            className="flex items-center gap-2"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter PowerShell command..."
            className="font-mono"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={!isConnected}
          />
          <Button type="submit" disabled={!isConnected}>
            Execute
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

    