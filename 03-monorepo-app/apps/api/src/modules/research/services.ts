import { createCompletion } from "@anvia/core";
import { getModel } from "../../utils/openai.js";

export async function generatePerspective(
  context: string,
  instructions: string,
) {
  const model = getModel();
  const response = await createCompletion(model, {
    instructions,
    input: context,
    maxTokens: 800,
  });

  return response.text;
}
