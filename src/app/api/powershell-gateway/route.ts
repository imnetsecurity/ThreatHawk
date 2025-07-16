// src/app/api/powershell-gateway/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { command, hostname } = await request.json();

  let output = `[Mock PowerShell Output for ${hostname}]
`;
  if (command.toLowerCase().includes("get-process")) {
    output += `Name                           Id   CPU(s)     WorkingSet(K)    PM(K)     WSEx(K)   Private(K)  Handles  ProcessName
`;
    output += `----                           --   ------     -------------    -----     -------   -----------  -------  ----------- 
`;
    output += `explorer                       1234 0.12       54321            50000     60000     50000       1500     explorer
`;
    output += `notepad                        5678 0.01       12345            10000     15000     10000       500      notepad
`;
  } else if (command.toLowerCase().includes("stop-process")) {
    output += `Attempting to stop process for command: '${command}'
`;
    output += `Process terminated successfully (mock).`;
  } else {
    output += `Command '${command}' executed successfully (mock).`;
  }

  return NextResponse.json({ output });
}
