"use server";

import fs from "fs/promises";
import path from "path";

export async function saveSettings(settings: { virusTotalApiKey: string }) {
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

  const lines = envContent.split("\n");
  let keyFound = false;

  const newLines = lines.map((line) => {
    if (line.startsWith("VIRUSTOTAL_API_KEY=")) {
      keyFound = true;
      return `VIRUSTOTAL_API_KEY=${settings.virusTotalApiKey}`;
    }
    return line;
  });

  if (!keyFound) {
    newLines.push(`VIRUSTOTAL_API_KEY=${settings.virusTotalApiKey}`);
  }

  await fs.writeFile(envPath, newLines.join("\n").trim());
}
