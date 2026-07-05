// Case 1
// A customer asks: "Why was I charged twice? Please fix it now." What should the Al decide before answering?

// 1. User Input: "Why was I charged twice? Please fix it now."
// 2. Prompt Router: AI classifies the input intent and routes to the correct agent.
// 3. Finance Support Agent: reply with a resolution or next steps.

// run: pnpm tsx src/assignment-1/01-case.ts


import { getFastModel, getModel } from "../utils";
import { createParsedCompletion, createCompletion } from "@anvia/core";
import z from "zod";
import "dotenv/config";

const userInput = "Why was I charged twice? Please fix it now.";

const PROMPT_INTENT = {
  general: "You are a general support assistant. You handle general inquiries and provide helpful information. The reply is concise, empathetic, and includes a concrete next step.",
  technical:
    "You are a technical support engineer. You handle issues related to software, hardware, and troubleshooting. the reply is concise, empathetic, and includes a concrete debugging step.",
  finance:
    "You are a finance support specialist. You handle issues related to billing, payments, and refunds. the reply is concise, empathetic, and includes a concrete next step or provide a resolution.",
};

const PromptIntentSchema = z.object({
  intent: z.enum(["general", "technical", "finance"]),
  reason: z.string(),
});

async function main(userInput: string) {

  console.log("User:", userInput);
  console.log("Thinking...");

  const extractedIntent = await createParsedCompletion(getFastModel(), {
    instructions:
      "Classify the intent of the user input to route to the correct agent",
    input: `User input: ${userInput}`,
    schema: PromptIntentSchema,
  });

  // console.log("Extracted Intent:", extractedIntent.data);

  const systemPrompt = PROMPT_INTENT[extractedIntent.data.intent];

 console.log("Customer Service Agent Typing...");

 const response = await createCompletion(getModel(), {
  instructions:
    systemPrompt,
  input: userInput,
});

  console.log("AI Agent:", response.text);
}

main(userInput);
