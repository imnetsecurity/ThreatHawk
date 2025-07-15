
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SortableRuleCard } from "./sortable-rule-card";
import type { YaraXRuleState } from "@/lib/yara-forge-types";

interface ConditionCardProps {
    id: string;
    state: YaraXRuleState;
    setState: React.Dispatch<React.SetStateAction<YaraXRuleState>>;
}

export const ConditionCard = React.forwardRef<HTMLTextAreaElement, ConditionCardProps>(
    ({ id, state, setState }, ref) => {
        return (
            <SortableRuleCard id={id} title="Condition">
                <div className="space-y-2">
                    <Label htmlFor="condition-textarea">
                        Define the boolean logic for the rule. Use string identifiers (e.g., $a, $b) and keywords.
                    </Label>
                    <Textarea
                        ref={ref}
                        id="condition-textarea"
                        value={state.condition}
                        onChange={(e) => setState(prev => ({...prev, condition: e.target.value}))}
                        className="font-mono h-32"
                        placeholder="e.g. uint32(0) == 0x5A4D and #hex_string > 5"
                    />
                </div>
            </SortableRuleCard>
        );
    }
);

ConditionCard.displayName = "ConditionCard";
