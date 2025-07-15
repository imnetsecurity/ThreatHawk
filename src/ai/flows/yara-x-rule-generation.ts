
'use server';

/**
 * @fileOverview Defines a Genkit flow for generating YARA-X rules from natural language.
 * 
 * - generateYaraXRuleFromText - A function that takes a text prompt and returns a YARA-X rule string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const YaraXRuleInputSchema = z.object({
  prompt: z.string().describe('A plain English description of the desired detection logic.'),
});

const YaraXRuleOutputSchema = z.string().describe('The generated YARA-X rule as a complete string. The rule should be valid and ready to be compiled.');

const yaraXPrompt = ai.definePrompt({
  name: 'yaraXPrompt',
  input: { schema: YaraXRuleInputSchema },
  output: { schema: YaraXRuleOutputSchema },
  prompt: `You are an expert cybersecurity analyst specializing in YARA-X, the next generation of YARA. Your task is to convert a user's plain English request into a highly specific and accurate YARA-X rule. You must follow YARA-X syntax and best practices precisely.

  **User's Request:**
  "{{prompt}}"

  **Your Task:**

  1.  **Deconstruct the Request:** Analyze the user's request to identify the core behavior or file characteristics to be detected. This includes file properties (PE headers, sections), imported functions, specific strings (text, hex, regex), and relationships between them.

  2.  **Structure the Rule:** Generate a single, complete YARA-X rule.
      *   Start with \`rule <rule_name> {\`. Choose a descriptive rule name based on the request.
      *   Create a \`meta\` section with at least an \`author\` and \`description\` field.
      *   Create a \`strings\` section to define all necessary patterns. Use appropriate identifiers (e.g., \`$text1\`, \`$hex1\`). Use text, hex, or regex strings as needed. Apply modifiers like \`nocase\`, \`wide\`, \`ascii\`, \`fullword\` where appropriate.
      *   Create a \`condition\` section. This is the most critical part. Use the string identifiers and combine them with file properties from modules like \`pe\`, \`elf\`, or \`math\`. For example: \`pe.entry_point == 0x1000 and $text1 and not $text2\`. The condition must be a valid boolean expression.

  3.  **Return Only the Rule:** Your entire output should be just the raw YARA-X rule text. Do not wrap it in markdown, JSON, or any other formatting.

  **Example Request:** "a rule to find PE files that import 'kernel32.dll' and contain the string 'CreateRemoteThread'"

  **Example Output (raw text):**
  \`\`\`
  rule find_createremotethread_in_pe {
    meta:
      author = "AI Assistant"
      description = "Detects PE files importing CreateRemoteThread from kernel32.dll"
    strings:
      $import = "kernel32.dll" wide ascii nocase
      $func = "CreateRemoteThread" ascii
    condition:
      pe.imports($import, $func)
  }
  \`\`\`
  
  Now, process the user's request and generate the YARA-X rule string.
  `,
});

export async function generateYaraXRuleFromText(prompt: string): Promise<string> {
    const { output } = await yaraXPrompt({ prompt });
    if (!output) {
        throw new Error("AI failed to generate a YARA-X rule.");
    }
    return output;
}
