import { OpenAIClient } from "@anvia/openai";

export const openaiClient = new OpenAIClient({
  baseUrl: process.env.AI_BASE_URL,
  apiKey: process.env.AI_API_KEY,
});

export function getModel(model: string = "deepseek-v4-flash") {
  return openaiClient.completionModel(model);
}
