'use server';

/**
 * @fileOverview Defines a Genkit tool for interacting with the VirusTotal API.
 * 
 * - getVirusTotalInfo - A tool that fetches a file hash report from VirusTotal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for the tool's input
const VirusTotalInputSchema = z.object({
  hash: z.string().describe('The SHA256, SHA1, or MD5 hash of the file.'),
});

// Define the schema for the tool's output
const VirusTotalOutputSchema = z.object({
  score: z.string().describe('The detection score, e.g., "57/70".'),
  url: z.string().describe('The URL to the full report on VirusTotal.'),
});

export const getVirusTotalInfo = ai.defineTool(
  {
    name: 'getVirusTotalInfo',
    description: 'Retrieves file reputation information from VirusTotal. Use this tool when a file hash is available to check if the file is known to be malicious.',
    inputSchema: VirusTotalInputSchema,
    outputSchema: VirusTotalOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      console.warn('VIRUSTOTAL_API_KEY is not set. Skipping VirusTotal check.');
      return { score: '0/0', url: '' };
    }

    const url = `https://www.virustotal.com/api/v3/files/${input.hash}`;
    const options = {
      method: 'GET',
      headers: {
        'x-apikey': apiKey,
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // If the hash is not found, VT returns a 404, which is not an error in our case.
        if (response.status === 404) {
          return { score: '0/0', url: `https://www.virustotal.com/gui/file/${input.hash}` };
        }
        throw new Error(`VirusTotal API error: ${response.statusText}`);
      }

      const data = await response.json();
      const attributes = data.data.attributes;
      const stats = attributes.last_analysis_stats;
      const malicious = stats.malicious + stats.suspicious;
      const total = stats.harmless + stats.malicious + stats.suspicious + stats['undetected'];
      
      return {
        score: `${malicious}/${total}`,
        url: `https://www.virustotal.com/gui/file/${input.hash}`,
      };
    } catch (error) {
      console.error('Failed to fetch from VirusTotal:', error);
      // Return a neutral score in case of an API error to avoid breaking the flow.
      return { score: '0/0', url: '' };
    }
  }
);
