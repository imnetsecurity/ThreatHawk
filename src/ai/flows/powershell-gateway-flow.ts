
'use server';

/**
 * @fileOverview Defines a Genkit flow for simulating PowerShell command execution.
 * 
 * - executePowerShellCommandFlow - A function that simulates running a PowerShell command.
 * - PowerShellInputSchema - The input type for the function.
 * - PowerShellOutputSchema - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const PowerShellInputSchema = z.object({
  command: z.string().describe('The PowerShell command to execute.'),
  hostname: z.string().describe('The hostname of the target machine, for context.'),
});
export type PowerShellInput = z.infer<typeof PowerShellInputSchema>;

export const PowerShellOutputSchema = z.string().describe('The simulated output of the PowerShell command.');
export type PowerShellOutput = z.infer<typeof PowerShellOutputSchema>;


const powershellGatewayPrompt = ai.definePrompt({
  name: 'powershellGatewayPrompt',
  input: { schema: PowerShellInputSchema },
  output: { schema: PowerShellOutputSchema },
  prompt: `You are a PowerShell terminal simulator for a security analysis tool called ThreatHawk. You are currently "connected" to the host: {{hostname}}.

    Your task is to provide realistic, text-based output for the given PowerShell command. 

    - For commands like 'Get-Process', 'Get-Service', 'whoami', 'ipconfig', 'netstat -an', provide a plausible, formatted text response as if you were a real terminal.
    - For commands that modify state like 'Stop-Process' or 'New-Item', respond with a confirmation message (e.g., "Process 'notepad.exe' with ID 1234 has been terminated.") or a realistic error. Do not ask for confirmation.
    - If the command is nonsensical or a common typo, return a realistic PowerShell error message.
    - Keep the output concise and believable. Do not include any explanation or commentary. Only return the raw text output of the command.

    Command to execute:
    \`\`\`powershell
    {{command}}
    \`\`\`
    `,
});

export async function executePowerShellCommandFlow(input: PowerShellInput): Promise<PowerShellOutput> {
  const { output } = await powershellGatewayPrompt(input);
  return output!;
}
