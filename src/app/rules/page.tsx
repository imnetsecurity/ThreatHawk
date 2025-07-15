
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { yaraRules, sysmonRules } from "@/lib/mock-data";
import { FileTree } from "./components/file-tree";
import { AiRuleCreator } from "./components/ai-rule-creator";
import { Separator } from "@/components/ui/separator";
import type { RuleFile } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function RulesPage() {
  const [selectedYaraRule, setSelectedYaraRule] = React.useState<RuleFile>(yaraRules[0]);
  const [yaraContent, setYaraContent] = React.useState(yaraRules[0].content);
  
  const [selectedSysmonRule, setSelectedSysmonRule] = React.useState<RuleFile>(sysmonRules[0]);
  const [sysmonContent, setSysmonContent] = React.useState(sysmonRules[0].content);

  const handleSelectYara = (fileId: string) => {
    const file = yaraRules.find(r => r.id === fileId);
    if (file) {
      setSelectedYaraRule(file);
      setYaraContent(file.content);
    }
  }

  const handleSelectSysmon = (fileId: string) => {
    const file = sysmonRules.find(r => r.id === fileId);
    if (file) {
      setSelectedSysmonRule(file);
      setSysmonContent(file.content);
    }
  }

  return (
    <Tabs defaultValue="sysmon">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="yara">YARA Rules</TabsTrigger>
        <TabsTrigger value="sysmon">Sysmon Configuration</TabsTrigger>
      </TabsList>
      <TabsContent value="yara">
        <Card>
          <CardHeader>
            <CardTitle>YARA Rule Management</CardTitle>
            <CardDescription>
              Create, edit, and manage your library of YARA rules for remote
              scanning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <FileTree title="YARA Files" files={yaraRules} selectedFile={selectedYaraRule.id} onSelectFile={handleSelectYara} />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  key={selectedYaraRule.id}
                  className="h-[600px] font-mono"
                  value={yaraContent}
                  onChange={(e) => setYaraContent(e.target.value)}
                />
              </div>
            </div>
             <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sysmon">
        <Card>
          <CardHeader>
            <CardTitle>Sysmon Configuration Management</CardTitle>
            <CardDescription>
              Edit, version, and deploy your master Sysmon configuration to
              agents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                 <FileTree title="Sysmon Configs" files={sysmonRules} selectedFile={selectedSysmonRule.id} onSelectFile={handleSelectSysmon} />
               </div>
               <div className="md:col-span-2">
                 <Textarea
                   key={selectedSysmonRule.id}
                   className="h-[600px] font-mono"
                   value={sysmonContent}
                   onChange={(e) => setSysmonContent(e.target.value)}
                 />
               </div>
            </div>
             <Button>Save & Deploy Config</Button>
            <Separator />
            <AiRuleCreator currentConfig={sysmonContent} onRuleAppend={setSysmonContent} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
