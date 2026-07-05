import z from "zod";
import { createCompletion, createParsedCompletion } from "@anvia/core";
import { getModel } from "../../utils";

const userInput =
  "Write a short support reply for a customer whose invoice was charged twice.";

const draft = await createCompletion(getModel(), {
  instructions:
    "You are a customer support agent. Write a concise and empathetic reply.",
  input: userInput,
});

const EvaluationSchema = z.object({
  passed: z.boolean(),
  score: z.number().min(1).max(5),
  feedback: z.string(),
});

const evaluation = await createParsedCompletion(getModel(), {
  instructions:
    "Evaluate whether the reply is concise, empathetic, and includes a concrete next step.",
  input: `User request: ${userInput}\n\nDraft reply: ${draft.text}`,
  schema: EvaluationSchema,
});

let finalReply = draft.text;

if (!evaluation.data.passed) {
  const revision = await createCompletion(getModel(), {
    instructions:
      "Revise the support reply using the evaluator feedback. Keep it short.",
    input: `Original request: ${userInput}

Draft reply:
${draft.text}

Evaluator feedback:
${evaluation.data.feedback}`,
  });

  finalReply = revision.text;
}

console.log(evaluation.data);
console.log(finalReply);
