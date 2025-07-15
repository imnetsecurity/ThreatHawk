"use server";

import fs from "fs/promises";
import path from "path";

export async function saveSettings(settings: { virusTotalApiKey: string, genkitModel: string }) {
  const envPath = path.resolve(process.cwd(), ".env");

  let envContent = "";
  try {
    envContent = await fs.readFile(envPath, "utf-8");
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error; // Rethrow if it's not a "file not found" error
    }
    // If the file doesn't exist, we'll create it.
  }

  let lines = envContent.split("\n").filter(line => line.trim() !== "");
  
  const settingsMap = new Map<string, string>();
  settingsMap.set('VIRUSTOTAL_API_KEY', settings.virusTotalApiKey);
  settingsMap.set('GENKIT_MODEL', settings.genkitModel);

  settingsMap.forEach((value, key) => {
    const keyIndex = lines.findIndex(line => line.startsWith(`${key}=`));
    if (keyIndex > -1) {
        lines[keyIndex] = `${key}=${value}`;
    } else {
        lines.push(`${key}=${value}`);
    }
  });

  await fs.writeFile(envPath, lines.join("\n").trim());
}
