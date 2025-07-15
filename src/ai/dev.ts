import { config } from 'dotenv';
config();

import '@/ai/flows/behavioral-anomaly-detection.ts';
import '@/ai/flows/ai-rule-generation.ts';
import '@/ai/flows/ai-rule-from-text.ts';
import '@/ai/flows/yara-scan-flow.ts';
import '@/ai/flows/powershell-gateway-flow.ts';
import '@/ai/flows/yara-x-rule-generation.ts';
import '@/ai/tools/virustotal.ts';
