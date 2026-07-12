import { createCompletion } from "@anvia/core";
import { getModel } from "../../utils/openai.js";
import { z } from "zod";
import { CreateResearchSchema } from "./schema.js";

type CreateResearchInput = z.infer<typeof CreateResearchSchema>;

export async function generateResearch(input: CreateResearchInput) {
  const model = getModel();

  const context = [
    `Target Market: ${input.targetMarket}`,
    `Industry: ${input.industry}`,
    input.location ? `Location: ${input.location}` : null,
    input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const instructions = `You are a market research analyst. Based on the following information, provide a market research perspective. Reference the target market, industry, and location in every point you make.

Include exactly one sentence for each:
- Market size estimation
- Key competitors
- Growth opportunities
- Potential challenges
- Recommendations

Each sentence must directly reference details from the provided context. Be specific and actionable.`;

  const response = await createCompletion(model, {
    instructions,
    input: context,
    maxTokens: 1500,
  });

  return {
    input,
    perspective: response.text,
  };
}
