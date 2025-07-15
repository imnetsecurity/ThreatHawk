
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle, ChevronsUpDown } from "lucide-react";
import { SortableRuleCard } from "./sortable-rule-card";
import type { YaraXRuleState, StringItem } from "@/lib/yara-forge-types";

interface StringsCardProps {
    id: string;
    state: YaraXRuleState;
    setState: React.Dispatch<React.SetStateAction<YaraXRuleState>>;
}

export function StringsCard({ id, state, setState }: StringsCardProps) {
    
    const handleAddStringItem = () => {
        const newItem: StringItem = {
            id: `string-${Date.now()}`,
            identifier: `$s${state.strings.length + 1}`,
            type: 'text',
            value: '',
            modifiers: { nocase: false, ascii: true, wide: false, fullword: false, private: false, xor: { enabled: false, min: 0, max: 255 }, base64: { enabled: false, alphabet: "" }, base64wide: { enabled: false, alphabet: ""} },
        };
        setState(prev => ({...prev, strings: [...prev.strings, newItem]}));
    };

    const handleRemoveStringItem = (itemId: string) => {
        setState(prev => ({...prev, strings: prev.strings.filter(item => item.id !== itemId)}));
    };

    const handleStringChange = <K extends keyof StringItem>(itemId: string, field: K, value: StringItem[K]) => {
         setState(prev => ({
            ...prev,
            strings: prev.strings.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
            )
        }));
    };
    
    const handleModifierChange = <K extends keyof StringItem['modifiers']>(itemId: string, field: K, value: StringItem['modifiers'][K]) => {
        setState(prev => ({
            ...prev,
            strings: prev.strings.map(item =>
                item.id === itemId ? { ...item, modifiers: { ...item.modifiers, [field]: value } } : item
            )
        }));
    };

    return (
        <SortableRuleCard id={id} title="Strings">
             <Accordion type="multiple" className="w-full space-y-2">
                {state.strings.map(item => (
                     <AccordionItem value={item.id} key={item.id} className="border rounded-md px-4">
                        <div className="flex justify-between items-center">
                            <AccordionTrigger className="flex-1">
                                <div className="flex items-center gap-2">
                                     <ChevronsUpDown className="h-4 w-4" />
                                    <span className="font-mono text-primary">{item.identifier}</span>
                                    <span className="text-muted-foreground truncate max-w-xs">{item.value}</span>
                                </div>
                            </AccordionTrigger>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveStringItem(item.id)} className="ml-2">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                        <AccordionContent className="pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-1">
                                    <Label>Identifier</Label>
                                    <Input value={item.identifier} onChange={e => handleStringChange(item.id, 'identifier', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Type</Label>
                                    <Select value={item.type} onValueChange={(v) => handleStringChange(item.id, 'type', v as StringItem['type'])}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="hex">Hex</SelectItem>
                                            <SelectItem value="regexp">RegExp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-1 mb-4">
                                <Label>Value</Label>
                                <Input value={item.value} onChange={e => handleStringChange(item.id, 'value', e.target.value)} className="font-mono"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Modifiers</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                     <div className="flex items-center space-x-2"><Checkbox checked={item.modifiers.nocase} onCheckedChange={c => handleModifierChange(item.id, 'nocase', !!c)} id={`${item.id}-nocase`} /><Label htmlFor={`${item.id}-nocase`}>nocase</Label></div>
                                     <div className="flex items-center space-x-2"><Checkbox checked={item.modifiers.ascii} onCheckedChange={c => handleModifierChange(item.id, 'ascii', !!c)} id={`${item.id}-ascii`}/><Label htmlFor={`${item.id}-ascii`}>ascii</Label></div>
                                     <div className="flex items-center space-x-2"><Checkbox checked={item.modifiers.wide} onCheckedChange={c => handleModifierChange(item.id, 'wide', !!c)} id={`${item.id}-wide`}/><Label htmlFor={`${item.id}-wide`}>wide</Label></div>
                                     <div className="flex items-center space-x-2"><Checkbox checked={item.modifiers.fullword} onCheckedChange={c => handleModifierChange(item.id, 'fullword', !!c)} id={`${item.id}-fullword`}/><Label htmlFor={`${item.id}-fullword`}>fullword</Label></div>
                                     <div className="flex items-center space-x-2"><Checkbox checked={item.modifiers.private} onCheckedChange={c => handleModifierChange(item.id, 'private', !!c)} id={`${item.id}-private`}/><Label htmlFor={`${item.id}-private`}>private</Label></div>
                                </div>
                                <div className="flex items-end gap-2 pt-2">
                                     <div className="flex items-center space-x-2"><Checkbox checked={item.modifiers.xor.enabled} onCheckedChange={c => handleModifierChange(item.id, 'xor', {...item.modifiers.xor, enabled: !!c})} id={`${item.id}-xor`} /> <Label htmlFor={`${item.id}-xor`}>xor</Label></div>
                                     <div className="space-y-1"><Label>Min</Label><Input type="number" value={item.modifiers.xor.min} onChange={e => handleModifierChange(item.id, 'xor', {...item.modifiers.xor, min: +e.target.value})} disabled={!item.modifiers.xor.enabled} /></div>
                                     <div className="space-y-1"><Label>Max</Label><Input type="number" value={item.modifiers.xor.max} onChange={e => handleModifierChange(item.id, 'xor', {...item.modifiers.xor, max: +e.target.value})} disabled={!item.modifiers.xor.enabled} /></div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
             <Button variant="outline" size="sm" className="mt-4" onClick={handleAddStringItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add String
            </Button>
        </SortableRuleCard>
    );
}
