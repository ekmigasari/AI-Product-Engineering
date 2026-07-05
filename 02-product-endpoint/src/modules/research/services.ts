import { createCompletion } from "@anvia/core";
import { getClient } from "../../utils/openai-config.js";

export async function generatePerspective(
  context: string,
  instructions: string,
) {
  const AI_API_KEY = process.env.AI_API_KEY as string;
  const AI_BASE_URL = process.env.AI_BASE_URL as string;

  const client = getClient({ apiKey: AI_API_KEY, baseUrl: AI_BASE_URL });
  const model = client.completionModel("glm-5.2");
  const response = await createCompletion(model, {
    instructions,
    input: context,
    maxTokens: 800,
  });

  return response.text;
}
