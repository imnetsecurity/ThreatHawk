
"use server";

import { executePowerShellCommandFlow } from "@/ai/flows/powershell-gateway-flow";

export async function executePowerShellCommand(command: string, hostname: string): Promise<string> {
    const result = await executePowerShellCommandFlow({ command, hostname });
    return result;
}
