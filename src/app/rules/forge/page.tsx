
"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableCard } from "./components/sortable-card";
import { AiGenerator } from "./components/ai-generator";
import {
  Copy,
  PlusCircle,
  Save,
  Trash2,
  Check,
} from "lucide-react";
import {
  SysmonRuleForgeOptions,
  SysmonEventRule,
  SysmonCondition,
  availableEventTypes,
} from "@/lib/sysmon-forge-types";
import { useToast } from "@/hooks/use-toast";

const initialOptions: SysmonRuleForgeOptions = {
  ruleGroupName: "CustomRuleGroup",
  topLevelGroupRelation: "OR",
  eventRules: [
    {
      id: "rule-1",
      eventType: "ProcessCreate",
      onmatch: "include",
      groupRelation: "AND",
      conditions: [
        {
          id: "cond-1",
          field: "Image",
          conditionType: "is",
          value: "C:\\Windows\\System32\\powershell.exe",
        },
      ],
    },
  ],
};

// Basic XML parser to update state from AI generation
const parseRuleXmlToState = (ruleXml: string): SysmonEventRule | null => {
    try {
        const ruleMatch = ruleXml.match(/<Rule\s+name="([^"]+)"\s+groupRelation="([^"]+)"/);
        if (!ruleMatch) return null;

        const eventTypeMatch = ruleXml.match(/<(\w+)\s+onmatch="([^"]+)"/);
        if (!eventTypeMatch) return null;

        const newRule: SysmonEventRule = {
            id: `rule-${Date.now()}`,
            eventType: eventTypeMatch[1],
            onmatch: eventTypeMatch[2] as "include" | "exclude",
            groupRelation: ruleMatch[2].toUpperCase() as "AND" | "OR",
            conditions: [],
        };
        
        const conditionRegex = /<(\w+)\s+condition="([^"]+)">([^<]+)<\/\1>/g;
        let match;
        while ((match = conditionRegex.exec(ruleXml)) !== null) {
            newRule.conditions.push({
                id: `cond-${Date.now()}-${newRule.conditions.length}`,
                field: match[1],
                conditionType: match[2],
                value: match[3],
            });
        }
        
        return newRule.conditions.length > 0 ? newRule : null;
    } catch (e) {
        console.error("Failed to parse rule XML:", e);
        return null;
    }
}


export default function SysmonForgePage() {
  const [options, setOptions] =
    React.useState<SysmonRuleForgeOptions>(initialOptions);
  const [generatedXml, setGeneratedXml] = React.useState("");
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const generateXml = React.useCallback(() => {
    let xml = `<Sysmon schemaversion="4.90">\n`;
    xml += `  <EventFiltering>\n`;
    xml += `    <RuleGroup name="${
      options.ruleGroupName
    }" groupRelation="${options.topLevelGroupRelation.toLowerCase()}">\n`;

    options.eventRules.forEach((rule) => {
      // Create a rule comment from the name attribute
      const ruleName = `TechniqueName, Txxxx`; // Placeholder name
      xml += `      <!-- ${ruleName} -->\n`;
      xml += `      <Rule groupRelation="${rule.groupRelation.toLowerCase()}" name="${ruleName}">\n`;
      xml += `        <${rule.eventType} onmatch="${rule.onmatch}">\n`;
      rule.conditions.forEach((cond) => {
        const condition = cond.conditionType.replace(/ /g, "");
        xml += `          <${cond.field} condition="${condition}">${cond.value}</${cond.field}>\n`;
      });
      xml += `        </${rule.eventType}>\n`;
      xml += `      </Rule>\n`;
    });

    xml += `    </RuleGroup>\n`;
    xml += `  </EventFiltering>\n`;
    xml += `</Sysmon>\n`;

    setGeneratedXml(xml);
  }, [options]);

  React.useEffect(() => {
    generateXml();
  }, [options, generateXml]);
  
  const handleRuleGenerated = (ruleXml: string) => {
    const newRule = parseRuleXmlToState(ruleXml);
    if (newRule) {
        setOptions(prev => ({...prev, eventRules: [...prev.eventRules, newRule]}));
        toast({
            title: "Rule Loaded into Builder",
            description: "The AI-generated rule has been added to the visual builder.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Parsing Failed",
            description: "Could not load the AI-generated rule into the builder. You can still copy it from the preview.",
        });
    }
    // Still update the preview with the raw XML
    let xml = `<Sysmon schemaversion="4.90">\n`;
    xml += `  <EventFiltering>\n`;
    xml += `    <RuleGroup name="${options.ruleGroupName}" groupRelation="${options.topLevelGroupRelation.toLowerCase()}">\n`;
    xml += `      ${ruleXml.split('\n').map(line => '  ' + line).join('\n')}\n`;
    xml += `    </RuleGroup>\n`;
    xml += `  </EventFiltering>\n`;
    xml += `</Sysmon>\n`;
    setGeneratedXml(xml);
  };


  const handleGlobalChange = (
    field: keyof SysmonRuleForgeOptions,
    value: string
  ) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  const addRule = () => {
    const newRule: SysmonEventRule = {
      id: `rule-${Date.now()}`,
      eventType: "ProcessCreate",
      onmatch: "include",
      groupRelation: "OR",
      conditions: [
        {
          id: `cond-${Date.now()}`,
          field: "Image",
          conditionType: "is",
          value: "",
        },
      ],
    };
    setOptions((prev) => ({
      ...prev,
      eventRules: [...prev.eventRules, newRule],
    }));
  };

  const removeRule = (ruleId: string) => {
    setOptions((prev) => ({
      ...prev,
      eventRules: prev.eventRules.filter((rule) => rule.id !== ruleId),
    }));
  };

  const handleRuleChange = (
    ruleId: string,
    field: keyof SysmonEventRule,
    value: string
  ) => {
    setOptions((prev) => ({
      ...prev,
      eventRules: prev.eventRules.map((rule) =>
        rule.id === ruleId ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const addCondition = (ruleId: string) => {
    const newCondition: SysmonCondition = {
      id: `cond-${Date.now()}`,
      field: "Image",
      conditionType: "is",
      value: "",
    };
    setOptions((prev) => ({
      ...prev,
      eventRules: prev.eventRules.map((rule) =>
        rule.id === ruleId
          ? { ...rule, conditions: [...rule.conditions, newCondition] }
          : rule
      ),
    }));
  };

  const removeCondition = (ruleId: string, conditionId: string) => {
    setOptions((prev) => ({
      ...prev,
      eventRules: prev.eventRules.map((rule) => {
        if (rule.id === ruleId) {
          // Prevent removing the last condition
          if (rule.conditions.length > 1) {
            return {
              ...rule,
              conditions: rule.conditions.filter(
                (cond) => cond.id !== conditionId
              ),
            };
          }
        }
        return rule;
      }),
    }));
  };

  const handleConditionChange = (
    ruleId: string,
    conditionId: string,
    field: keyof SysmonCondition,
    value: string
  ) => {
    setOptions((prev) => ({
      ...prev,
      eventRules: prev.eventRules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              conditions: rule.conditions.map((cond) =>
                cond.id === conditionId ? { ...cond, [field]: value } : cond
              ),
            }
          : rule
      ),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOptions((prev) => {
        const oldIndex = prev.eventRules.findIndex(
          (rule) => rule.id === active.id
        );
        const newIndex = prev.eventRules.findIndex(
          (rule) => rule.id === over.id
        );
        return {
          ...prev,
          eventRules: arrayMove(prev.eventRules, oldIndex, newIndex),
        };
      });
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedXml);
    setHasCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the Sysmon configuration.",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const handleSaveToRepository = () => {
     toast({
        title: "Feature not implemented",
        description: "Saving to the configuration repository is not yet available.",
      });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle>Sysmon Rule Forge</CardTitle>
        <CardDescription>
          Visually build, reorder, and generate complex Sysmon configurations.
          Drag and drop rule blocks to change their evaluation order.
        </CardDescription>
      </CardHeader>
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        <ResizablePanel defaultSize={60} minSize={40}>
           <Tabs defaultValue="builder" className="h-full flex flex-col">
              <TabsList className="mx-6 mt-4">
                <TabsTrigger value="builder">Visual Builder</TabsTrigger>
                <TabsTrigger value="ai_generator">AI Generator</TabsTrigger>
              </TabsList>
              <TabsContent value="builder" className="flex-grow overflow-hidden">
                  <ScrollArea className="h-full p-6 pt-2">
                    <Card className="p-4 mb-4">
                      <CardTitle className="text-lg mb-2">Global Settings</CardTitle>
                      <div className="flex flex-wrap gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rule-group-name">Rule Group Name</Label>
                          <Input
                            id="rule-group-name"
                            value={options.ruleGroupName}
                            onChange={(e) =>
                              handleGlobalChange("ruleGroupName", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="top-level-logic">
                            Top-Level Group Logic
                          </Label>
                          <Select
                            value={options.topLevelGroupRelation}
                            onValueChange={(value) =>
                              handleGlobalChange("topLevelGroupRelation", value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OR">OR</SelectItem>
                              <SelectItem value="AND">AND</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={options.eventRules}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {options.eventRules.map((rule) => (
                            <SortableCard key={rule.id} id={rule.id}>
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">
                                  Event Filter Block
                                </h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeRule(rule.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label>Event Type</Label>
                                  <Select
                                    value={rule.eventType}
                                    onValueChange={(value) =>
                                      handleRuleChange(rule.id, "eventType", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableEventTypes.map((evt) => (
                                        <SelectItem key={evt.id} value={evt.name}>
                                          {evt.id}: {evt.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Action (onmatch)</Label>
                                  <Select
                                    value={rule.onmatch}
                                    onValueChange={(value) =>
                                      handleRuleChange(rule.id, "onmatch", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="include">Include</SelectItem>
                                      <SelectItem value="exclude">Exclude</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Condition Logic</Label>
                                  <Select
                                    value={rule.groupRelation}
                                    onValueChange={(value) =>
                                      handleRuleChange(rule.id, "groupRelation", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="OR">OR</SelectItem>
                                      <SelectItem value="AND">AND</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {rule.conditions.map((condition) => {
                                  const availableFields =
                                    availableEventTypes.find(
                                      (e) => e.name === rule.eventType
                                    )?.commonFields || [];

                                  return (
                                    <div
                                      key={condition.id}
                                      className="flex flex-wrap items-end gap-2"
                                    >
                                      <div className="flex-1 min-w-[150px] space-y-1">
                                        <Label>Field</Label>
                                        <Select
                                          value={condition.field}
                                          onValueChange={(value) =>
                                            handleConditionChange(
                                              rule.id,
                                              condition.id,
                                              "field",
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {availableFields.map((field) => (
                                              <SelectItem key={field} value={field}>
                                                {field}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex-1 min-w-[150px] space-y-1">
                                        <Label>Condition</Label>
                                        <Select
                                          value={condition.conditionType}
                                          onValueChange={(value) =>
                                            handleConditionChange(
                                              rule.id,
                                              condition.id,
                                              "conditionType",
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="is">is</SelectItem>
                                            <SelectItem value="is not">is not</SelectItem>
                                            <SelectItem value="contains">contains</SelectItem>
                                            <SelectItem value="contains any">contains any</SelectItem>
                                            <SelectItem value="contains all">contains all</SelectItem>
                                            <SelectItem value="excludes">excludes</SelectItem>
                                            <SelectItem value="begin with">begin with</SelectItem>
                                            <SelectItem value="end with">end with</SelectItem>
                                            <SelectItem value="less than">less than</SelectItem>
                                            <SelectItem value="more than">more than</SelectItem>
                                            <SelectItem value="image">image</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex-[3] min-w-[250px] space-y-1">
                                        <Label>Value</Label>
                                        <Input
                                          value={condition.value}
                                          onChange={(e) =>
                                            handleConditionChange(
                                              rule.id,
                                              condition.id,
                                              "value",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          removeCondition(rule.id, condition.id)
                                        }
                                        disabled={rule.conditions.length <= 1}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => addCondition(rule.id)}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
                              </Button>
                            </SortableCard>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <Button className="mt-4" variant="secondary" onClick={addRule}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Event Filter Block
                    </Button>
                  </ScrollArea>
              </TabsContent>
               <TabsContent value="ai_generator" className="flex-grow overflow-auto p-6 pt-2">
                 <AiGenerator onRuleGenerated={handleRuleGenerated} />
               </TabsContent>
           </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="flex flex-col h-full p-6 pt-0">
             <div className="flex justify-between items-center py-4">
                <h3 className="text-lg font-semibold">Generated XML Preview</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="ml-2">{hasCopied ? "Copied" : "Copy"}</span>
                    </Button>
                    <Button size="sm" onClick={handleSaveToRepository}>
                        <Save className="h-4 w-4 mr-2" />
                        Save to Repository
                    </Button>
                </div>
            </div>
            <Textarea
              value={generatedXml}
              readOnly
              className="flex-grow font-mono bg-black/80 text-white text-xs resize-none"
              placeholder="XML will be generated here..."
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
