
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { YaraXRuleState, BuilderItem } from "@/lib/yara-forge-types";
import { HeaderCard } from "./components/header-card";
import { MetaCard } from "./components/meta-card";
import { StringsCard } from "./components/strings-card";
import { ConditionCard } from "./components/condition-card";
import { KeywordBrowser } from "./components/keyword-browser";
import { AiGenerator } from "./components/ai-generator";
import { CliBuilder } from "./components/cli-builder";


const initialRuleState: YaraXRuleState = {
  isGlobal: false,
  isPrivate: false,
  identifier: "my_rule",
  tags: ["scanner", "threathawk"],
  meta: [
    { id: "meta-1", key: "author", value: "ThreatHawk", type: "string" },
    { id: "meta-2", key: "version", value: "1.0", type: "string" },
  ],
  strings: [
    {
      id: "string-1",
      identifier: "$hex_string",
      type: "hex",
      value: "{ E2 34 A1 C8 23 FB }",
      modifiers: { nocase: false, ascii: false, wide: false, fullword: false, private: false, xor: { enabled: false, min: 0, max: 255 }, base64: { enabled: false, alphabet: "" }, base64wide: { enabled: false, alphabet: ""} },
    },
    {
      id: "string-2",
      identifier: "$text_string",
      type: "text",
      value: "evil.exe",
      modifiers: { nocase: true, ascii: true, wide: false, fullword: false, private: false, xor: { enabled: false, min: 0, max: 255 }, base64: { enabled: false, alphabet: "" }, base64wide: { enabled: false, alphabet: ""} },
    },
  ],
  condition: "$hex_string or $text_string",
};

const initialBuilderItems: BuilderItem[] = [
    { id: 'header', type: 'header' },
    { id: 'meta', type: 'meta' },
    { id: 'strings', type: 'strings' },
    { id: 'condition', type: 'condition' },
]


export default function YaraForgePage() {
  const [ruleState, setRuleState] = React.useState<YaraXRuleState>(initialRuleState);
  const [generatedRule, setGeneratedRule] = React.useState("");
  const [builderItems, setBuilderItems] = React.useState<BuilderItem[]>(initialBuilderItems);
  const [hasCopied, setHasCopied] = React.useState(false);

  const { toast } = useToast();
  const conditionRef = React.useRef<HTMLTextAreaElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const generateRuleFromState = React.useCallback(() => {
    let rule = "";

    if (ruleState.isGlobal) rule += "global ";
    if (ruleState.isPrivate) rule += "private ";
    
    rule += `rule ${ruleState.identifier} `;
    if (ruleState.tags.length > 0) {
        rule += `: ${ruleState.tags.join(" ")} `;
    }
    rule += "{\n";

    const sections: Record<string, string> = {
        meta: "",
        strings: "",
        condition: ""
    };

    // Meta section
    if (ruleState.meta.length > 0) {
        sections.meta += "  meta:\n";
        ruleState.meta.forEach(item => {
            if (item.key && item.value) {
                const value = item.type === "string" ? `"${item.value}"` : item.value;
                sections.meta += `    ${item.key} = ${value}\n`;
            }
        });
    }

    // Strings section
    if (ruleState.strings.length > 0) {
        sections.strings += "  strings:\n";
        ruleState.strings.forEach(s => {
            if (s.identifier && s.value) {
                let valuePart = "";
                if (s.type === 'text') valuePart = `"${s.value}"`;
                else if (s.type === 'hex') valuePart = s.value;
                else if (s.type === 'regexp') valuePart = `/${s.value}/`;

                let modifiers = "";
                if (s.modifiers.nocase) modifiers += " nocase";
                if (s.modifiers.ascii) modifiers += " ascii";
                if (s.modifiers.wide) modifiers += " wide";
                if (s.modifiers.fullword) modifiers += " fullword";
                if (s.modifiers.private) modifiers += " private";
                if (s.modifiers.xor.enabled) modifiers += ` xor(${s.modifiers.xor.min}-${s.modifiers.xor.max})`;

                sections.strings += `    ${s.identifier} = ${valuePart}${modifiers}\n`;
            }
        });
    }

    // Condition section
    sections.condition += "  condition:\n";
    sections.condition += `    ${ruleState.condition}\n`;

    builderItems.forEach(item => {
        if(item.type !== 'header' && sections[item.type]) {
            rule += `\n${sections[item.type]}`;
        }
    })


    rule += "}";
    setGeneratedRule(rule);
  }, [ruleState, builderItems]);

  React.useEffect(() => {
    generateRuleFromState();
  }, [ruleState, generateRuleFromState]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setBuilderItems((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedRule);
    setHasCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "You can now use the YARA-X rule.",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const handleSaveToRepository = () => {
     toast({
        title: "Feature not implemented",
        description: "Saving to the rule repository is not yet available.",
      });
  };

  const insertIntoCondition = (textToInsert: string) => {
    const textarea = conditionRef.current;
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + textToInsert + text.substring(end);
        
        setRuleState(prev => ({...prev, condition: newText}));

        // Move cursor after inserted text
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
        }, 0);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle>YARA-X Rule Forge</CardTitle>
        <CardDescription>
          Visually build, reorder, and generate YARA-X rules. Use the keyword
          browser to discover and insert module syntax.
        </CardDescription>
      </CardHeader>
      
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={30}>
            <Tabs defaultValue="builder" className="p-4 h-full flex flex-col">
                <TabsList className="mb-4">
                    <TabsTrigger value="builder">Dashboard Builder</TabsTrigger>
                    <TabsTrigger value="ai_generator">AI Generator</TabsTrigger>
                </TabsList>
                <TabsContent value="builder" className="flex-grow overflow-auto pr-2">
                     <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        >
                        <SortableContext items={builderItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                            {builderItems.map(item => {
                                switch (item.type) {
                                    case 'header':
                                        return <HeaderCard key={item.id} id={item.id} state={ruleState} setState={setRuleState} />
                                    case 'meta':
                                        return <MetaCard key={item.id} id={item.id} state={ruleState} setState={setRuleState} />
                                    case 'strings':
                                        return <StringsCard key={item.id} id={item.id} state={ruleState} setState={setRuleState} />
                                    case 'condition':
                                        return <ConditionCard key={item.id} id={item.id} state={ruleState} setState={setRuleState} ref={conditionRef} />
                                    default:
                                        return null;
                                }
                            })}
                            </div>
                        </SortableContext>
                    </DndContext>
                </TabsContent>
                <TabsContent value="ai_generator">
                    <AiGenerator onRuleGenerated={(rule) => {
                        setGeneratedRule(rule);
                        toast({title: "AI Rule Generated", description: "The rule has been populated in the preview panel."});
                    }}/>
                </TabsContent>
            </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={25}>
                 <div className="flex flex-col h-full p-4">
                     <div className="flex justify-between items-center pb-2">
                        <h3 className="text-lg font-semibold">Live Preview</h3>
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
                      value={generatedRule}
                      readOnly
                      className="flex-grow font-mono bg-black/80 text-white text-xs resize-none"
                      placeholder="YARA-X rule will be generated here..."
                    />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className="p-4 h-full">
                <Tabs defaultValue="keywords" className="h-full flex flex-col">
                  <TabsList>
                    <TabsTrigger value="keywords">Module Keywords</TabsTrigger>
                    <TabsTrigger value="cli">CLI Builder</TabsTrigger>
                  </TabsList>
                  <TabsContent value="keywords" className="flex-grow overflow-auto mt-2">
                    <KeywordBrowser onInsert={insertIntoCondition} />
                  </TabsContent>
                  <TabsContent value="cli">
                    <CliBuilder />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
