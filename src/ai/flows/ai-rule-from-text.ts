
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
  prompt: `You are a senior cybersecurity analyst and an expert in creating Sysmon configurations. Your task is to convert a user's plain English request into a highly specific and accurate Sysmon rule. You must follow Sysmon XML schema and best practices precisely.

  **User's Request:**
  "{{request}}"

  **Your Task:**

  1.  **Deconstruct the Request:** Analyze the user's request to identify the core behavior to be detected. This includes processes, parent processes, command-line arguments, registry keys, network connections, file hashes, etc.

  2.  **Select the Correct Event:** Based on your analysis, choose the single most appropriate Sysmon event type to target. Here are some key events:
      *   **Event ID 1: ProcessCreate:** Use for process execution events. Key fields: \`Image\`, \`CommandLine\`, \`ParentImage\`, \`Hashes\`.
      *   **Event ID 3: NetworkConnect:** Use for network connections. Key fields: \`Image\`, \`DestinationIp\`, \`DestinationPort\`, \`Protocol\`.
      *   **Event ID 11: FileCreate:** Use for file creation/write events. Key fields: \`TargetFilename\`, \`Image\`.
      *   **Event ID 12, 13, 14: RegistryEvent:** Use for registry modifications. Key fields: \`EventType\` (CreateKey, SetValue), \`TargetObject\`.
      *   **Event ID 22: DnsQuery:** Use for DNS lookups. Key fields: \`QueryName\`, \`Image\`.

  3.  **Construct the Rule:**
      *   Generate a single, complete \`<Rule>\` ... \`</Rule>\` block in XML format. **Do not** include the parent \`<RuleGroup>\` or \`<Sysmon>\` tags.
      *   The rule must have \`groupRelation="or"\`.
      *   The event block (e.g., \`<ProcessCreate\`) inside the rule must have \`onmatch="include"\`.
      *   Use the correct XML field names for the chosen event type.
      *   Use appropriate condition attributes (e.g., 'is', 'contains', 'begin with', 'end with'). Be as specific as possible.
      *   Create a descriptive name for the rule in the 'name' attribute, like "technique_name, T1234.001".
      *   Add an XML comment inside the rule to explain its logic in one sentence.

  4.  **Provide an Explanation:** Write a brief, clear explanation of how the generated rule fulfills the user's request, mentioning the event ID you chose and why.

  **Example Request:** "Detect when powershell.exe is launched by winword.exe"

  **Example Output (as a valid JSON object):**
  \`\`\`json
  {
    "ruleXml": "<Rule name=\\"technique_name, T1059.001\\" groupRelation=\\"or\\">\\n  <!-- Detects PowerShell being spawned by a Microsoft Office application. -->\\n  <ProcessCreate onmatch=\\"include\\">\\n    <ParentImage condition=\\"is\\">C:\\\\Program Files\\\\Microsoft Office\\\\root\\\\Office16\\\\WINWORD.EXE</ParentImage>\\n    <Image condition=\\"is\\">C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe</Image>\\n  </ProcessCreate>\\n</Rule>",
    "explanation": "This rule uses Sysmon Event ID 1 (ProcessCreate) to detect when 'winword.exe' (ParentImage) launches 'powershell.exe' (Image). This is a common tactic for macro-based attacks."
  }
  \`\`\`
  
  Now, process the user's request.
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
