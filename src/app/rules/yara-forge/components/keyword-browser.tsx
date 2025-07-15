
"use client";

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    yaraModules, 
    YaraModule, 
    KeywordItem
} from '@/lib/yara-forge-keywords';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface KeywordBrowserProps {
    onInsert: (text: string) => void;
}

export function KeywordBrowser({ onInsert }: KeywordBrowserProps) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState<KeywordItem | null>(null);

    const filteredModules = React.useMemo(() => {
        if (!searchTerm) {
            return yaraModules;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();

        return yaraModules.map(module => {
            const functions = module.functions?.filter(f => f.name.toLowerCase().includes(lowerCaseSearch) || f.signature.toLowerCase().includes(lowerCaseSearch));
            const fields = module.fields?.filter(f => f.name.toLowerCase().includes(lowerCaseSearch) || f.signature.toLowerCase().includes(lowerCaseSearch));
            const constants = module.constants?.filter(c => c.name.toLowerCase().includes(lowerCaseSearch) || c.signature.toLowerCase().includes(lowerCaseSearch));

            if (functions?.length || fields?.length || constants?.length) {
                return { ...module, functions, fields, constants };
            }
            return null;
        }).filter((m): m is YaraModule => m !== null);

    }, [searchTerm]);

    const renderItem = (item: KeywordItem) => (
        <RadioGroupItem key={item.signature} value={item.signature} id={item.signature} className="sr-only" />
    );

    const renderLabel = (item: KeywordItem) => (
        <Label 
            key={item.name} 
            htmlFor={item.signature}
            className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-md cursor-pointer has-[[data-state=checked]]:bg-secondary"
        >
            <div>
                <p className="font-mono text-sm">{item.signature}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
        </Label>
    );

    const allItems = React.useMemo(() => filteredModules.flatMap(m => [
        ...(m.functions || []),
        ...(m.fields || []),
        ...(m.constants || [])
    ]), [filteredModules]);

    const handleSelectionChange = (signature: string) => {
        const item = allItems.find(i => i.signature === signature);
        setSelectedItem(item || null);
    }
    
    const handleInsert = () => {
        if (selectedItem) {
            onInsert(selectedItem.insertValue);
        }
    }

    return (
        <div className="h-full flex flex-col">
            <Input 
                placeholder="Search keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
            />
            <ScrollArea className="flex-grow pr-2">
                <RadioGroup onValueChange={handleSelectionChange}>
                    <Accordion type="multiple" defaultValue={yaraModules.map(m => m.name)}>
                        {filteredModules.map(module => (
                            <AccordionItem value={module.name} key={module.name}>
                                <AccordionTrigger>{module.name}</AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    {module.functions && module.functions.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground px-2">Functions</h4>
                                            {module.functions.map(item => <>{renderItem(item)}{renderLabel(item)}</>)}
                                        </div>
                                    )}
                                     {module.fields && module.fields.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground px-2">Fields</h4>
                                            {module.fields.map(item => <>{renderItem(item)}{renderLabel(item)}</>)}
                                        </div>
                                    )}
                                    {module.constants && module.constants.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground px-2">Constants</h4>
                                            {module.constants.map(item => <>{renderItem(item)}{renderLabel(item)}</>)}
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </RadioGroup>
            </ScrollArea>
             <div className="pt-2 border-t">
                 <Button size="sm" className="w-full" disabled={!selectedItem} onClick={handleInsert}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 
                    {selectedItem ? `Add "${selectedItem.name}"` : 'Select a Keyword'}
                </Button>
             </div>
        </div>
    );
}
