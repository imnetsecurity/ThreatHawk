
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle } from "lucide-react";
import { SortableRuleCard } from "./sortable-rule-card";
import type { YaraXRuleState, MetaItem } from "@/lib/yara-forge-types";
import { Checkbox } from "@/components/ui/checkbox";

interface MetaCardProps {
    id: string;
    state: YaraXRuleState;
    setState: React.Dispatch<React.SetStateAction<YaraXRuleState>>;
}

export function MetaCard({ id, state, setState }: MetaCardProps) {
    const handleAddMetaItem = () => {
        const newItem: MetaItem = {
            id: `meta-${Date.now()}`,
            key: "",
            value: "",
            type: "string",
        };
        setState(prev => ({...prev, meta: [...prev.meta, newItem]}));
    };

    const handleRemoveMetaItem = (itemId: string) => {
        setState(prev => ({...prev, meta: prev.meta.filter(item => item.id !== itemId)}));
    };

    const handleMetaChange = <K extends keyof MetaItem>(itemId: string, field: K, value: MetaItem[K]) => {
         setState(prev => ({
            ...prev,
            meta: prev.meta.map(item => {
                if (item.id === itemId) {
                    const updatedItem = { ...item, [field]: value };
                    // Reset value if type changes
                    if (field === 'type') {
                        if (value === 'boolean') updatedItem.value = false;
                        else if (value === 'integer') updatedItem.value = 0;
                        else updatedItem.value = "";
                    }
                    return updatedItem;
                }
                return item;
            })
        }));
    };

    const renderValueInput = (item: MetaItem) => {
        switch (item.type) {
            case 'boolean':
                return (
                    <div className="flex items-center h-10">
                        <Checkbox
                            checked={!!item.value}
                            onCheckedChange={(checked) => handleMetaChange(item.id, 'value', !!checked)}
                        />
                    </div>
                );
            case 'integer':
                return (
                    <Input
                        type="number"
                        value={item.value as number}
                        onChange={(e) => handleMetaChange(item.id, 'value', parseInt(e.target.value, 10) || 0)}
                    />
                );
            case 'string':
            default:
                return (
                     <Input
                        type="text"
                        value={item.value as string}
                        onChange={(e) => handleMetaChange(item.id, 'value', e.target.value)}
                        placeholder="Value"
                    />
                );
        }
    };


    return (
        <SortableRuleCard id={id} title="Meta">
            <div className="space-y-3">
                {state.meta.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-end gap-2">
                        <div className="flex-1 min-w-[150px] space-y-1">
                            <Label>Key</Label>
                            <Input
                                value={item.key}
                                onChange={(e) => handleMetaChange(item.id, 'key', e.target.value)}
                                placeholder="e.g. author"
                            />
                        </div>
                         <div className="flex-1 min-w-[120px] space-y-1">
                            <Label>Type</Label>
                             <Select
                                value={item.type}
                                onValueChange={(value) => handleMetaChange(item.id, 'type', value as MetaItem['type'])}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="string">String</SelectItem>
                                    <SelectItem value="integer">Integer</SelectItem>
                                    <SelectItem value="boolean">Boolean</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-[2] min-w-[200px] space-y-1">
                            <Label>Value</Label>
                            {renderValueInput(item)}
                        </div>
                         <Button variant="ghost" size="icon" onClick={() => handleRemoveMetaItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
             <Button variant="outline" size="sm" className="mt-4" onClick={handleAddMetaItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Meta Item
            </Button>
        </SortableRuleCard>
    );
}
