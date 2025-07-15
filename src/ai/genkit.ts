import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: process.env.GENKIT_MODEL || 'googleai/gemini-1.5-flash-latest',
});
