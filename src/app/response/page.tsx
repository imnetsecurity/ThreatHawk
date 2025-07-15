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
import { executePowerShellCommand } from "./actions";

type TerminalLine = {
  type: "command" | "output" | "system" | "error";
  content: string;
};

export default function ResponsePage() {
  const agents = [
    ...new Map(
      sysmonEvents.map((item) => [item.agent.hostname, item.agent])
    ).values(),
  ];

  const [selectedAgent, setSelectedAgent] = React.useState<string>("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [command, setCommand] = React.useState("");
  const [history, setHistory] = React.useState<TerminalLine[]>([
    { type: "system", content: "ThreatHawk PowerShell Gateway v1.0" },
    { type: "system", content: "Please select an agent and click 'Connect'." },
  ]);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  React.useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

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
        { type: "system", content: `Connection successful. Use 'exit' to disconnect.` },
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

  const handleExecute = async () => {
    if (!command || isExecuting) return;

    if (command.toLowerCase().trim() === 'exit') {
        handleDisconnect();
        setCommand("");
        return;
    }

    const newHistory: TerminalLine[] = [
      ...history,
      { type: "command", content: command },
    ];
    setHistory(newHistory);
    setCommand("");
    setIsExecuting(true);

    try {
      const result = await executePowerShellCommand(command, selectedAgent);
      setHistory((prev) => [...prev, { type: "output", content: result }]);
    } catch (error) {
      console.error("Command execution failed:", error);
      setHistory((prev) => [...prev, { type: "error", content: "Command failed to execute." }]);
    } finally {
      setIsExecuting(false);
    }
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
            <Button onClick={handleConnect} disabled={isConnecting || !selectedAgent}>
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
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, index) => (
            <div key={index}>
              {line.type === "command" && (
                <div className="flex gap-2">
                  <span className="text-cyan-400">
                    PS {selectedAgent}&gt;
                  </span>
                  <span className="text-white flex-1">{line.content}</span>
                </div>
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
              {line.type === "error" && (
                 <p className="text-destructive">
                    {line.content}
                 </p>
              )}
            </div>
          ))}
           {isExecuting && (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Executing...</span>
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
          <span className="text-cyan-400 font-mono hidden sm:inline">PS {selectedAgent}&gt;</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground sm:hidden" />
          <Input
            ref={inputRef}
            placeholder="Enter PowerShell command..."
            className="font-mono"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={!isConnected || isExecuting}
            autoComplete="off"
          />
          <Button type="submit" disabled={!isConnected || isExecuting || !command}>
            Execute
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
