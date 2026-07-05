// Case 1 with Intent Evaluator
// A customer asks: "Why was I charged twice? Please fix it now." What should the Al decide before answering?

// 1. User Input: "Why was I charged twice? Please fix it now."
// 2. Prompt Router: AI classifies the input intent and routes to the correct agent (Finance support).
// 3. Evaluator (Optional): checks if the intent is classified correctly. 
// 4. Finance Support Agent: reply with a resolution or next steps.

// run: pnpm tsx src/assignment-1/04-case.ts


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

  console.log("User Input:", userInput);
  console.log("Thinking...");

  const extractedIntent = await createParsedCompletion(getFastModel(), {
    instructions:
      "Classify the intent of the user input to route to the correct agent",
    input: `User input: ${userInput}`,
    schema: PromptIntentSchema,
  });

  // console.log("Extracted Intent:", extractedIntent.data);

  const IntentEvaluationSchema = z.object({
    passed: z.boolean(),
    score: z.number().min(1).max(5),
    feedback: z.string(),
  });

  const intentEvaluation = await createParsedCompletion(getFastModel(), {
    instructions:
      "Evaluate whether the intent classification is accurate given the user input. The available intents are: general, technical, finance.",
    input: `User input: ${userInput}\n\nClassified intent: ${extractedIntent.data.intent}\nReason: ${extractedIntent.data.reason}`,
    schema: IntentEvaluationSchema,
  });

  console.log("Intent Evaluation:", intentEvaluation.data);

  let finalIntent = extractedIntent.data.intent;

  if (!intentEvaluation.data.passed) {
    const reClassified = await createParsedCompletion(getFastModel(), {
      instructions:
        "Re-classify the intent of the user input using the evaluator feedback. The available intents are: general, technical, finance.",
      input: `User input: ${userInput}\n\nPrevious classification: ${extractedIntent.data.intent}\nEvaluator feedback: ${intentEvaluation.data.feedback}`,
      schema: PromptIntentSchema,
    });

    console.log("Re-classified Intent:", reClassified.data);
    finalIntent = reClassified.data.intent;
  }

  console.log("Final Intent:", finalIntent);
  console.log("Prompt Intent:", PROMPT_INTENT[finalIntent]);

  const systemPrompt = PROMPT_INTENT[finalIntent]

 console.log("Customer Service Agent Typing...");

 const response = await createCompletion(getModel(), {
  instructions:
    systemPrompt,
  input: userInput,
});

  console.log("AI Agent:", response.text);
}

main(userInput);
