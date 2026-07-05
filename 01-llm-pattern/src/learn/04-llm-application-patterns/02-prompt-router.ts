import { getModel } from "../../utils";
import { createParsedCompletion } from "@anvia/core";
import z from "zod";
import "dotenv/config";

const PROMPT_INTENT = {
  technical:
    "You are a technical support engineer. Give concrete debugging steps.",
  billing:
    "You are a billing support specialist. Ask for account details politely.",
  general: "You are a general support assistant. Give a short helpful answer.",
};

const PromptIntentSchema = z.object({
  intent: z.enum(["technical", "billing", "general"]),
  reason: z.string(),
});

async function main(prompt: string) {
  const extractedIntent = await createParsedCompletion(getModel(), {
    instructions:
      "Classify the intent of the user input to route to the correct agent",
    input: `User input: ${prompt}`,
    schema: PromptIntentSchema,
  });

  console.log(extractedIntent.data);
  console.log(PROMPT_INTENT[extractedIntent.data.intent]);

  // -> Next step ?
}

main("How can i get a refund for my order?");
