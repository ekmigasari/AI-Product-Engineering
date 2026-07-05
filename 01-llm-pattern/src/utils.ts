import { OpenAIClient } from "@anvia/openai";
import { tavily } from "@tavily/core";
import "dotenv/config";

const openClient = new OpenAIClient({
  baseUrl: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function getFastModel(model: string = "openrouter/owl-alpha") {
  return openClient.completionModel(model);
}

export function getModel(model: string = "openrouter/owl-alpha") {
  return openClient.completionModel(model);
}

export const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY!,
});
