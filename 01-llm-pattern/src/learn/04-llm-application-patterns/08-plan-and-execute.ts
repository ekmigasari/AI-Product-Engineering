import z from "zod";
import { createCompletion, createParsedCompletion } from "@anvia/core";
import { getModel } from "../../utils";

const goal =
  "Create a launch checklist for a small team releasing a TypeScript SDK.";

const PlanSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      objective: z.string(),
    }),
  ),
});

const plan = await createParsedCompletion(getModel(), {
  instructions:
    "Break the goal into 4 clear execution steps. Each step must have a title and objective.",
  input: goal,
  schema: PlanSchema,
});

const stepOutputs = [];

for (const step of plan.data.steps) {
  const output = await createCompletion(getModel(), {
    instructions:
      "Complete this checklist section with concrete, actionable bullets.",
    input: `Goal: ${goal}

Section: ${step.title}
Objective: ${step.objective}`,
  });

  // if else calling tavily
  // Summary

  stepOutputs.push({
    title: step.title,
    output: output.text,
  });
}

const finalChecklist = await createCompletion(getModel(), {
  instructions:
    "Combine the completed sections into one clean launch checklist. Remove duplicate items.",
  input: JSON.stringify(stepOutputs),
});

console.log(plan.data);
console.log(finalChecklist.text);
