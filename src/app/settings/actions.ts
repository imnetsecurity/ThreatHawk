"use server";

import fs from "fs/promises";
import path from "path";

export async function saveSettings(settings: { 
  virusTotalApiKey: string;
  genkitProvider: 'google' | 'ollama';
  googleModel: string;
  ollamaHost: string;
  ollamaModel: string;
}) {
  const envPath = path.resolve(process.cwd(), ".env");

  let envContent = "";
  try {
    envContent = await fs.readFile(envPath, "utf-8");
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const lines = envContent.split("\n");
  const settingsMap = new Map<string, string>();
  
  // Set VirusTotal Key
  settingsMap.set('VIRUSTOTAL_API_KEY', settings.virusTotalApiKey);

  // Clear existing AI provider settings to avoid conflicts
  const aikeys = ['GENKIT_MODEL', 'OLLAMA_HOST', 'OLLAMA_MODEL'];
  const filteredLines = lines.filter(line => !aikeys.some(key => line.startsWith(`${key}=`)));

  // Set new AI provider settings
  if (settings.genkitProvider === 'google') {
    settingsMap.set('GENKIT_MODEL', settings.googleModel);
  } else {
    settingsMap.set('OLLAMA_HOST', settings.ollamaHost);
    settingsMap.set('OLLAMA_MODEL', settings.ollamaModel);
  }

  let finalLines = filteredLines;
  settingsMap.forEach((value, key) => {
    const keyIndex = finalLines.findIndex(line => line.startsWith(`${key}=`));
    const newLine = `${key}=${value}`;
    if (keyIndex > -1) {
      if (finalLines[keyIndex] !== newLine) {
        finalLines[keyIndex] = newLine;
      }
    } else if (value) {
      finalLines.push(newLine);
    }
  });

  await fs.writeFile(envPath, finalLines.filter(line => line.trim() !== "").join("\n"));
}
