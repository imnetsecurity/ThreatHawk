"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileTree } from "./file-tree";
import { AiRuleCreator } from "./ai-rule-creator";
import { Separator } from "@/components/ui/separator";
import type { RuleFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Scan, Wrench, Microscope } from "lucide-react";
import { YaraScanDialog } from "../../events/components/yara-scan-dialog";

interface RulesManagerProps {
  initialYaraRules: RuleFile[];
  initialSysmonRules: RuleFile[];
}

export function RulesManager({ initialYaraRules, initialSysmonRules }: RulesManagerProps) {
  const [yaraRules, setYaraRules] = React.useState<RuleFile[]>(initialYaraRules);
  const [sysmonRules, setSysmonRules] = React.useState<RuleFile[]>(initialSysmonRules);

  const [selectedYaraRule, setSelectedYaraRule] = React.useState<RuleFile>(
    yaraRules[0] || { id: "", name: "new_rule.yara", content: "" }
  );
  const [yaraContent, setYaraContent] = React.useState(selectedYaraRule.content);

  const [selectedSysmonRule, setSelectedSysmonRule] = React.useState<RuleFile>(
    sysmonRules[0] || { id: "", name: "new_config.xml", content: "" }
  );
  const [sysmonContent, setSysmonContent] = React.useState(selectedSysmonRule.content);
  
  const [isYaraScanOpen, setIsYaraScanOpen] = React.useState(false);

  const [isSavingYara, setIsSavingYara] = React.useState(false);
  const [isSavingSysmon, setIsSavingSysmon] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setSelectedYaraRule(yaraRules[0] || { id: "", name: "new_rule.yara", content: "" });
    setYaraContent(yaraRules[0]?.content || "");
  }, [yaraRules]);

  React.useEffect(() => {
    setSelectedSysmonRule(sysmonRules[0] || { id: "", name: "new_config.xml", content: "" });
    setSysmonContent(sysmonRules[0]?.content || "");
  }, [sysmonRules]);

  const handleSelectYara = (fileId: string) => {
    const file = yaraRules.find((r) => r.id === fileId);
    if (file) {
      setSelectedYaraRule(file);
      setYaraContent(file.content);
    }
  };

  const handleSelectSysmon = (fileId: string) => {
    const file = sysmonRules.find((r) => r.id === fileId);
    if (file) {
      setSelectedSysmonRule(file);
      setSysmonContent(file.content);
    }
  };

  const handleSaveYara = () => {
    setIsSavingYara(true);
    // Simulate API call, replace with actual fetch to /api/rules/yara
    setTimeout(() => {
      toast({
        title: "YARA Rule Saved!",
        description: `Changes to ${selectedYaraRule.name} have been saved.`,
      });
      setIsSavingYara(false);
    }, 1000);
  };

  const handleSaveSysmon = () => {
    setIsSavingSysmon(true);
    // Simulate API call, replace with actual fetch to /api/rules/sysmon
    setTimeout(() => {
      toast({
        title: "Sysmon Config Saved & Deployed!",
        description: `Configuration ${selectedSysmonRule.name} has been deployed.`,
      });
      setIsSavingSysmon(false);
    }, 1500);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-2">
              <div>
                <CardTitle>YARA Rule Management</CardTitle>
                <CardDescription>
                  Create, edit, and test your library of YARA rules.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                    <Link href="/rules/yara-forge">
                        <Microscope className="mr-2 h-4 w-4" />
                        Open YARA-X Rule Forge
                    </Link>
                </Button>
                <Button variant="outline" onClick={() => setIsYaraScanOpen(true)}>
                    <Scan className="mr-2 h-4 w-4" />
                    Test a Rule
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <FileTree
                  title="YARA Files"
                  files={yaraRules}
                  selectedFile={selectedYaraRule.id}
                  onSelectFile={handleSelectYara}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  key={selectedYaraRule.id}
                  className="h-[400px] font-mono"
                  value={yaraContent}
                  onChange={(e) => setYaraContent(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveYara} disabled={isSavingYara}>
              {isSavingYara && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save YARA Rule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Sysmon Configuration Management</CardTitle>
                    <CardDescription>
                    Edit, version, and deploy your master Sysmon configuration to agents.
                    </CardDescription>
                </div>
                <Button asChild>
                    <Link href="/rules/forge">
                        <Wrench className="mr-2 h-4 w-4" />
                        Open Sysmon Rule Forge
                    </Link>
                </Button>
             </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <FileTree
                  title="Sysmon Configs"
                  files={sysmonRules}
                  selectedFile={selectedSysmonRule.id}
                  onSelectFile={handleSelectSysmon}
                />
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
            <Button onClick={handleSaveSysmon} disabled={isSavingSysmon}>
              {isSavingSysmon && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save & Deploy Config
            </Button>
            <Separator />
            <AiRuleCreator
              currentConfig={sysmonContent}
              onRuleAppend={setSysmonContent}
            />
          </CardContent>
        </Card>
      </div>
      <YaraScanDialog 
        isOpen={isYaraScanOpen}
        setIsOpen={setIsYaraScanOpen}
        initialRuleId={selectedYaraRule.id}
      />
    </>
  );
}
