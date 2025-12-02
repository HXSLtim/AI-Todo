import OpenAI from "openai";
import { ParseResult } from "../types";

const apiKey = process.env.OPENAI_API_KEY || process.env.API_KEY;
// If running in development (and not in a browser environment that blocks it), use proxy
const isDev = import.meta.env?.DEV;
// OpenAI SDK requires an absolute URL. In browser, we use window.location.origin to make the proxy path absolute.
const baseURL = isDev 
  ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/proxy` 
  : (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1");
const modelName = process.env.OPENAI_MODEL_NAME || "gpt-4o-mini";

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
  dangerouslyAllowBrowser: true, // Required for client-side usage in Vite
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
    }, { timeout: 10000 }); // 10 seconds timeout

    const content = response.choices[0].message.content;
    if (!content) {
      return { tasks: [] };
    }

    return JSON.parse(content) as ParseResult;
  } catch (e) {
    console.error("Failed to parse OpenAI response", e);
    return { tasks: [] };
  }
};
