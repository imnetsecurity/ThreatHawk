"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function executePowerShellCommand(command: string, hostname: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/powershell-gateway`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, hostname }),
    });
    if (!res.ok) throw new Error('Failed to execute PowerShell command');
    const { output } = await res.json();
    return output;
}
