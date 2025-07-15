import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, HardDrive } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sysmonEvents } from "@/lib/mock-data";

export default function ResponsePage() {
  // Get unique hostnames from mock data
  const agents = [
    ...new Map(sysmonEvents.map((item) => [item.agent.hostname, item.agent])).values(),
  ];

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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <label htmlFor="agent-select" className="font-medium">
              Target Agent:
            </label>
          </div>
          <Select>
            <SelectTrigger id="agent-select" className="w-[350px]">
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
          <Button>Connect</Button>
        </div>

        <div className="font-mono text-sm bg-black rounded-lg p-4 h-[500px] overflow-y-auto text-white space-y-2">
          <p>ThreatHawk PowerShell Gateway v1.0</p>
          <p>
            Copyright (c) 2024 ThreatHawk Inc. All rights reserved.
          </p>
          <p className="text-lime-400">
            Connecting to WS-FIN-01.corp.local...
          </p>
          <p className="text-green-400">Connection successful.</p>
          <p>&nbsp;</p>
          <div>
            <span className="text-cyan-400">
              PS C:\Users\th-admin&gt;
            </span>{" "}
            <span className="text-white">Get-Process -Name "winword"</span>
          </div>
          <pre className="whitespace-pre-wrap">
{`
Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    850      55    98140     145820      23.50   4567   1 winword
`}
          </pre>
           <div>
            <span className="text-cyan-400">
              PS C:\Users\th-admin&gt;
            </span>{" "}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <Input placeholder="Enter PowerShell command..." className="font-mono" />
          <Button type="submit">Execute</Button>
        </div>
      </CardContent>
    </Card>
  );
}
