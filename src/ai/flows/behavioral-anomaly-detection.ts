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
import {getVirusTotalInfo} from '@/ai/tools/virustotal';

const DetectBehavioralAnomalyInputSchema = z.object({
  sysmonEventData: z
    .string()
    .describe(
      'A JSON string containing Sysmon event data.  This data should include user, host, process, and network activity.'
    ),
  fileHash: z
    .string()
    .optional()
    .describe('An optional file hash (SHA256, MD5, or SHA1) to be checked against VirusTotal.'),
});
export type DetectBehavioralAnomalyInput = z.infer<typeof DetectBehavioralAnomalyInputSchema>;

const DetectBehavioralAnomalyOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the activity is anomalous.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why the activity is considered anomalous, including specific deviations from the learned baseline and insights from any tool outputs.'
    ),
  virusTotalScore: z
    .string()
    .optional()
    .describe('The VirusTotal detection score, if available (e.g., "57/70").'),
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
  tools: [getVirusTotalInfo],
  prompt: `You are an AI-powered security analyst tasked with detecting anomalous behavior in system event data.

You will be provided with Sysmon event data in JSON format. Your task is to analyze this data, compare it against a learned baseline of normal user and host behavior, and identify any significant deviations that could indicate malicious activity.

If a file hash is provided, use the getVirusTotalInfo tool to enrich your analysis. A high detection score from VirusTotal is a strong indicator of maliciousness. Incorporate the findings from VirusTotal into your explanation. If no file hash is provided, perform your analysis based on the other event details.

Based on your complete analysis, determine whether the activity is anomalous and provide a detailed explanation.

If a high-confidence anomaly is detected, suggest a Sysmon rule (in XML format) to formally detect this behavior in the future.

Here is the Sysmon event data:
{{sysmonEventData}}

{{#if fileHash}}
File Hash for analysis: {{fileHash}}
{{/if}}`,
});

const detectBehavioralAnomalyFlow = ai.defineFlow(
  {
    name: 'detectBehavioralAnomalyFlow',
    inputSchema: DetectBehavioralAnomalyInputSchema,
    outputSchema: DetectBehavioralAnomalyOutputSchema,
  },
  async input => {
    const llmResponse = await detectBehavioralAnomalyPrompt(input);
    const output = llmResponse.output;

    // Manually extract tool output to populate virusTotalScore
    const virusTotalToolCall = llmResponse.history.find(
      (turn) => turn.role === 'tool' && turn.part.toolResponse.name === 'getVirusTotalInfo'
    );

    if (virusTotalToolCall && virusTotalToolCall.part.toolResponse) {
       const toolOutput = virusTotalToolCall.part.toolResponse.output as any;
       if (toolOutput?.score) {
          output!.virusTotalScore = toolOutput.score;
       }
    }

    return output!;
  }
);
