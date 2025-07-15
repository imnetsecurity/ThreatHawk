
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating Sysmon rules from a natural language text description.
 *
 * - generateSysmonRuleFromText - A function that takes a text request and returns a Sysmon rule.
 * - GenerateSysmonRuleFromTextInput - The input type for the function.
 * - GenerateSysmonRuleFromTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSysmonRuleFromTextInputSchema = z.object({
  request: z.string().describe('A plain English description of the desired detection logic.'),
});
export type GenerateSysmonRuleFromTextInput = z.infer<typeof GenerateSysmonRuleFromTextInputSchema>;

const GenerateSysmonRuleFromTextOutputSchema = z.object({
  ruleXml: z
    .string()
    .describe(
      'The generated Sysmon rule in XML format. The rule should be a complete, valid Rule element ready to be inserted into a Sysmon configuration file.'
    ),
  explanation: z
    .string()
    .describe(
      'A brief explanation of how the generated rule achieves the user\'s request.'
    ),
});
export type GenerateSysmonRuleFromTextOutput = z.infer<typeof GenerateSysmonRuleFromTextOutputSchema>;


export async function generateSysmonRuleFromText(input: GenerateSysmonRuleFromTextInput): Promise<GenerateSysmonRuleFromTextOutput> {
  return generateSysmonRuleFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSysmonRuleFromTextPrompt',
  input: {schema: GenerateSysmonRuleFromTextInputSchema},
  output: {schema: GenerateSysmonRuleFromTextOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in Sysmon rule creation. Your task is to convert a user's plain English request into a well-formed Sysmon rule.

  The user's request is:
  "{{request}}"

  Generate a single, complete Sysmon <Rule>...</Rule> block in XML format that can be added to a larger configuration. Do not include the parent <RuleGroup> or <Sysmon> tags.

  The rule should be well-commented to explain its logic.

  Also provide a brief explanation of how the generated rule fulfills the user's request.

  Return the output as a valid JSON object.
  `,
});


const generateSysmonRuleFromTextFlow = ai.defineFlow(
  {
    name: 'generateSysmonRuleFromTextFlow',
    inputSchema: GenerateSysmonRuleFromTextInputSchema,
    outputSchema: GenerateSysmonRuleFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
