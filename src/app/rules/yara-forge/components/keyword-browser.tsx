
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
    YaraFunction, 
    YaraField, 
    YaraConstant, 
    KeywordItem
} from '@/lib/yara-forge-keywords';

interface KeywordBrowserProps {
    onInsert: (text: string) => void;
}

export function KeywordBrowser({ onInsert }: KeywordBrowserProps) {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredModules = React.useMemo(() => {
        if (!searchTerm) {
            return yaraModules;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();

        return yaraModules.map(module => {
            const filteredFunctions = module.functions?.filter(f => f.name.toLowerCase().includes(lowerCaseSearch));
            const filteredFields = module.fields?.filter(f => f.name.toLowerCase().includes(lowerCaseSearch));
            const filteredConstants = module.constants?.filter(c => c.name.toLowerCase().includes(lowerCaseSearch));

            if (filteredFunctions?.length || filteredFields?.length || filteredConstants?.length) {
                return { ...module, functions: filteredFunctions, fields: filteredFields, constants: filteredConstants };
            }
            return null;
        }).filter((m): m is YaraModule => m !== null);

    }, [searchTerm]);

    const renderItem = (item: KeywordItem) => (
         <div key={item.name} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-md">
            <div>
                <p className="font-mono text-sm">{item.signature}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onInsert(item.insertValue)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
        </div>
    )


    return (
        <div className="h-full flex flex-col">
            <Input 
                placeholder="Search keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
            />
            <ScrollArea className="flex-grow">
                <Accordion type="multiple">
                    {filteredModules.map(module => (
                        <AccordionItem value={module.name} key={module.name}>
                            <AccordionTrigger>{module.name}</AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                {module.functions && module.functions.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-xs text-muted-foreground px-2">Functions</h4>
                                        {module.functions.map(renderItem)}
                                    </div>
                                )}
                                 {module.fields && module.fields.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-xs text-muted-foreground px-2">Fields</h4>
                                        {module.fields.map(renderItem)}
                                    </div>
                                )}
                                {module.constants && module.constants.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-xs text-muted-foreground px-2">Constants</h4>
                                        {module.constants.map(renderItem)}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </div>
    );
}
