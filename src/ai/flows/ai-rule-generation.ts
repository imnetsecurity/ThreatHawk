'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-driven Sysmon rule generation based on detected anomalies.
 *
 * - generateSysmonRule - A function that takes anomaly details as input and returns a suggested Sysmon rule.
 * - GenerateSysmonRuleInput - The input type for the generateSysmonRule function.
 * - GenerateSysmonRuleOutput - The return type for the generateSysmonRule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSysmonRuleInputSchema = z.object({
  anomalyDescription: z
    .string()
    .describe(
      'A detailed description of the detected anomaly, including the processes, network connections, or user activities involved.'
    ),
  relevantSysmonEvents: z
    .string()
    .describe(
      'Example Sysmon events (as JSON or text) that triggered the anomaly detection. Include the event IDs, timestamps, and relevant fields.'
    ),
});
export type GenerateSysmonRuleInput = z.infer<typeof GenerateSysmonRuleInputSchema>;

const GenerateSysmonRuleOutputSchema = z.object({
  suggestedRuleName: z.string().describe('A concise name for the suggested Sysmon rule.'),
  suggestedRuleXml: z
    .string()
    .describe(
      'The suggested Sysmon rule in XML format, ready for deployment. Include comments to explain the rule logic.'
    ),
  confidenceScore: z
    .number()
    .describe(
      'A score (0-1) indicating the confidence level of the AI in the quality and relevance of the generated rule.'
    ),
  rationale: z
    .string()
    .describe(
      'A brief explanation of why the AI recommends this specific Sysmon rule, and how it addresses the detected anomaly.'
    ),
});
export type GenerateSysmonRuleOutput = z.infer<typeof GenerateSysmonRuleOutputSchema>;

export async function generateSysmonRule(input: GenerateSysmonRuleInput): Promise<GenerateSysmonRuleOutput> {
  return generateSysmonRuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSysmonRulePrompt',
  input: {schema: GenerateSysmonRuleInputSchema},
  output: {schema: GenerateSysmonRuleOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in Sysmon rule creation.

  Based on the provided anomaly description and relevant Sysmon events, generate a Sysmon rule in XML format that effectively detects the anomalous behavior in the future.

  Provide a confidence score (0-1) indicating your certainty in the rule's quality and relevance. Also, explain why you recommend this specific rule and how it addresses the detected anomaly.

  Here's the anomaly description:
  {{anomalyDescription}}

  Here are the relevant Sysmon events:
  {{relevantSysmonEvents}}

  Ensure the suggested Sysmon rule is well-formed XML and includes comments to explain the rule logic.

  Return the output as a valid JSON object.
  `,
});

const generateSysmonRuleFlow = ai.defineFlow(
  {
    name: 'generateSysmonRuleFlow',
    inputSchema: GenerateSysmonRuleInputSchema,
    outputSchema: GenerateSysmonRuleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
