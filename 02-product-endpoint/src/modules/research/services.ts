import { createCompletion } from "@anvia/core";
import { getClient } from "../../utils/openai-config.js";

export async function generatePerspective(
  context: string,
  instructions: string,
) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

  const client = getClient({ apiKey: OPENAI_API_KEY });
  const model = client.completionModel("gemini/gemini-3.5-flash");
  const response = await createCompletion(model, {
    instructions,
    input: context,
    maxTokens: 3000,
  });

  return response.text;
}
