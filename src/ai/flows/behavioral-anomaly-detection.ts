// This is a server-side file.
'use server';

/**
 * @fileOverview Implements the behavioral anomaly detection flow.
 *
 * - detectBehavioralAnomaly - Analyzes system events to detect anomalous behavior.
 * - DetectBehavioralAnomalyInput - The input type for the detectBehavioralAnomaly function.
 * - DetectBehavioralAnomalyOutput - The return type for the detectBehavioralAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBehavioralAnomalyInputSchema = z.object({
  sysmonEventData: z
    .string()
    .describe(
      'A JSON string containing Sysmon event data.  This data should include user, host, process, and network activity.'
    ),
});
export type DetectBehavioralAnomalyInput = z.infer<typeof DetectBehavioralAnomalyInputSchema>;

const DetectBehavioralAnomalyOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the activity is anomalous.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why the activity is considered anomalous, including specific deviations from the learned baseline.'
    ),
  suggestedSysmonRule: z
    .string()
    .optional()
    .describe(
      'A suggested Sysmon rule to detect this behavior in the future, formatted as an XML string.'
    ),
});

export type DetectBehavioralAnomalyOutput = z.infer<typeof DetectBehavioralAnomalyOutputSchema>;

export async function detectBehavioralAnomaly(
  input: DetectBehavioralAnomalyInput
): Promise<DetectBehavioralAnomalyOutput> {
  return detectBehavioralAnomalyFlow(input);
}

const detectBehavioralAnomalyPrompt = ai.definePrompt({
  name: 'detectBehavioralAnomalyPrompt',
  input: {schema: DetectBehavioralAnomalyInputSchema},
  output: {schema: DetectBehavioralAnomalyOutputSchema},
  prompt: `You are an AI-powered security analyst tasked with detecting anomalous behavior in system event data.

You will be provided with Sysmon event data in JSON format. Your task is to analyze this data, compare it against a learned baseline of normal user and host behavior, and identify any significant deviations that could indicate malicious activity.

Based on your analysis, determine whether the activity is anomalous and provide a detailed explanation of why it is considered anomalous. This explanation should include specific deviations from the learned baseline.

If a high-confidence anomaly is detected, suggest a Sysmon rule (in XML format) to formally detect this behavior in the future. This rule should be specific to the detected anomaly and designed to minimize false positives.

Here is the Sysmon event data:

{{sysmonEventData}}`,
});

const detectBehavioralAnomalyFlow = ai.defineFlow(
  {
    name: 'detectBehavioralAnomalyFlow',
    inputSchema: DetectBehavioralAnomalyInputSchema,
    outputSchema: DetectBehavioralAnomalyOutputSchema,
  },
  async input => {
    const {output} = await detectBehavioralAnomalyPrompt(input);
    return output!;
  }
);
