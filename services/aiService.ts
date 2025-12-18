import OpenAI from "openai";
import { ParseResult } from "../types";

// Helper to get environment variables with fallbacks
function getEnvVar(key: string): string | undefined {
  // Try import.meta.env (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Try process.env (Node.js / build-time)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // Try global window.ENV (runtime injection)
  if (typeof window !== 'undefined' && (window as any).ENV && (window as any).ENV[key]) {
    return (window as any).ENV[key];
  }
  return undefined;
}

const apiKey = getEnvVar('OPENAI_API_KEY') || getEnvVar('API_KEY');
// Force proxy path to avoid CORS - always use /api/proxy/v1
// This ensures requests go through EdgeOne Pages rewrite rules
let baseURL = "/api/proxy/v1";

// Debug logging
if (typeof window !== 'undefined') {
  console.log('[AI Service] Forced proxy baseURL:', baseURL);
  console.log('[AI Service] OPENAI_BASE_URL env (ignored):', getEnvVar('OPENAI_BASE_URL'));
}

// Prepend current origin for absolute URL
if (typeof window !== 'undefined') {
  baseURL = window.location.origin + baseURL;
  console.log('[AI Service] Final baseURL with origin:', baseURL);
}

// Development mode handling
const isDev = import.meta.env?.DEV;
if (isDev) {
  baseURL = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/proxy/v1`;
  console.log('[AI Service] Development proxy:', baseURL);
}

const modelName = getEnvVar('OPENAI_MODEL_NAME') || "gpt-4o-mini";

// Debug: Log the final configuration before creating OpenAI instance
if (typeof window !== 'undefined') {
  console.log('[AI Service] OpenAI Config:', {
    baseURL: baseURL,
    apiKey: apiKey ? '***' : 'MISSING',
    model: modelName
  });
}

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
  dangerouslyAllowBrowser: true, // Required for client-side usage in Vite
  maxRetries: 0, // Disable retries to avoid multiple CORS errors
});

export const parseTodoInput = async (input: string): Promise<ParseResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables (OPENAI_API_KEY).");
  }

  const now = new Date();
  const currentLocalTime = now.toLocaleString('en-US', { hour12: false });
  const currentDayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

  const systemPrompt = `Analyze the following natural language input and extract structured to-do items.

Current System Time (Local): ${currentLocalTime}
Current Day: ${currentDayOfWeek}

Instructions:
1. Extract tasks.
2. STRICT TIME PARSING:
   - Calculate the exact absolute time based on the "Current System Time".
   - If "in 10 minutes" is said, add 10 minutes to current time.
   - If "at 5" is said, assume 5:00. If 5:00 has passed today, assume tomorrow 5:00, unless context implies otherwise.
   - If only a date is given (e.g. "tomorrow"), default to 09:00:00.
   - If "tonight", default to 19:00:00.
   - OUTPUT FORMAT: ISO 8601 string (YYYY-MM-DDTHH:mm:ss). Do NOT use UTC 'Z' suffix. Return local time representation.
3. PRIORITY: Detect priority based on keywords. Default 'medium'.
4. Categorize tasks: 'work', 'personal', 'urgent', 'misc'.

You must output a valid JSON object matching the following schema:
{
  "tasks": [
    {
      "summary": "string (A short, actionable title)",
      "dueDateTime": "string (ISO 8601 timestamp YYYY-MM-DDTHH:mm:ss) or null",
      "description": "string (Additional details) or null",
      "category": "work" | "personal" | "urgent" | "misc",
      "priority": "high" | "medium" | "low"
    }
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      response_format: { type: "json_object" },
    }, { timeout: 100000 }); // 100 seconds timeout - AI responses may take longer

    const content = response.choices[0].message.content;
    if (!content) {
      return { tasks: [] };
    }

    // Clean up markdown code blocks if present
    let cleanedContent = content.trim();
    // Remove markdown code blocks (```json ... ``` or ``` ... ```)
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleanedContent) as ParseResult;
  } catch (e) {
    console.error("Failed to parse OpenAI response", e);
    return { tasks: [] };
  }
};
