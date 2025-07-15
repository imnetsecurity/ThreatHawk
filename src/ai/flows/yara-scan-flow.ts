
'use server';

/**
 * @fileOverview Defines a Genkit flow for performing a simulated YARA scan.
 * 
 * - performYaraScan - A function that simulates scanning a file hash against YARA rules.
 * - PerformYaraScanInput - The input type for the function.
 * - PerformYaraScanOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const PerformYaraScanInputSchema = z.object({
  fileHash: z.string().describe('The hash of the file to be scanned.'),
  yaraRule: z.string().describe('The YARA rule content to use for the scan.'),
});
export type PerformYaraScanInput = z.infer<typeof PerformYaraScanInputSchema>;

export const PerformYaraScanOutputSchema = z.object({
  didMatch: z.boolean().describe('Whether the YARA rule matched the file.'),
  matchedRuleName: z.string().optional().describe('The name of the rule that matched, if any.'),
  matchDetails: z.string().optional().describe('Details about the match, such as matched strings or patterns.'),
});
export type PerformYaraScanOutput = z.infer<typeof PerformYaraScanOutputSchema>;


export async function performYaraScan(input: PerformYaraScanInput): Promise<PerformYaraScanOutput> {
  return performYaraScanFlow(input);
}


const prompt = ai.definePrompt({
    name: 'performYaraScanPrompt',
    input: { schema: PerformYaraScanInputSchema },
    output: { schema: PerformYaraScanOutputSchema },
    prompt: `You are a YARA scan engine simulator. You will receive a file hash and a YARA rule.
    
    Your task is to determine if the provided YARA rule would likely match a file with the given hash.
    
    Analyze the YARA rule provided:
    Rule:
    \`\`\`yara
    {{yaraRule}}
    \`\`\`

    Analyze the file hash provided: {{fileHash}}

    Based on the rule's name, strings, and conditions, decide if it's plausible that this rule would match.
    For example, if the rule name is "APT29_Dukebot" and the hash is a known APT29 hash, you should report a match. If the rule looks for "mimikatz" strings and the hash is a known Mimikatz hash, you should report a match. If there is no logical connection, report no match.

    If you determine a match, set didMatch to true, and provide the name of the rule that matched and some plausible details for the match.
    If there is no match, set didMatch to false.

    Return the output as a valid JSON object.
    `,
});


const performYaraScanFlow = ai.defineFlow(
  {
    name: 'performYaraScanFlow',
    inputSchema: PerformYaraScanInputSchema,
    outputSchema: PerformYaraScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
