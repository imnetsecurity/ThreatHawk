
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableRuleCard } from "./sortable-rule-card";
import type { YaraXRuleState } from "@/lib/yara-forge-types";

interface HeaderCardProps {
    id: string;
    state: YaraXRuleState;
    setState: React.Dispatch<React.SetStateAction<YaraXRuleState>>;
}

export function HeaderCard({ id, state, setState }: HeaderCardProps) {
    const [tagInput, setTagInput] = React.useState("");

    const handleAddTag = () => {
        if (tagInput && !state.tags.includes(tagInput)) {
            setState(prev => ({...prev, tags: [...prev.tags, tagInput]}));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setState(prev => ({...prev, tags: prev.tags.filter(tag => tag !== tagToRemove)}));
    };

    return (
        <SortableRuleCard id={id} title="Rule Header">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="rule-identifier">Identifier</Label>
                    <Input
                        id="rule-identifier"
                        value={state.identifier}
                        onChange={(e) => setState(prev => ({...prev, identifier: e.target.value}))}
                        placeholder="my_awesome_rule"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Flags</Label>
                    <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="global-flag"
                                checked={state.isGlobal}
                                onCheckedChange={(checked) => setState(prev => ({...prev, isGlobal: !!checked}))}
                            />
                            <Label htmlFor="global-flag">Global</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="private-flag"
                                checked={state.isPrivate}
                                onCheckedChange={(checked) => setState(prev => ({...prev, isPrivate: !!checked}))}
                            />
                            <Label htmlFor="private-flag">Private</Label>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="rule-tags">Tags</Label>
                     <div className="flex gap-2">
                        <Input
                            id="rule-tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag and press Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                        />
                        <Button onClick={handleAddTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {state.tags.map(tag => (
                            <div key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                                <span>{tag}</span>
                                <button onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-destructive/20 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SortableRuleCard>
    );
}
