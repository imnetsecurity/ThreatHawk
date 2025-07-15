import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {ollama} from 'genkitx-ollama';

const ollamaHost = process.env.OLLAMA_HOST;
const ollamaModel = process.env.OLLAMA_MODEL;

const geminiModel = process.env.GENKIT_MODEL || 'googleai/gemini-1.5-flash-latest';

// Conditionally configure plugins based on environment variables
const plugins = [];
let model;

if (ollamaHost && ollamaModel) {
  // Use Ollama if host and model are specified
  plugins.push(ollama({
    host: ollamaHost,
    models: [{ name: ollamaModel }],
  }));
  model = ollamaModel;
  console.log(`Initializing Genkit with Ollama provider: ${model} at ${ollamaHost}`);
} else {
  // Default to Google AI
  plugins.push(googleAI());
  model = geminiModel;
  console.log(`Initializing Genkit with Google AI provider: ${model}`);
}

export const ai = genkit({
  plugins,
  model,
});
