import z from "zod";
import { createCompletion, createParsedCompletion } from "@anvia/core";
import { getModel } from "../../utils";

const productIdea =
  "A mobile app that helps freelance developers track project scope changes.";

const specialistPrompts = {
  product: "You are a product manager. Find user value and missing features.",
  engineering:
    "You are a senior engineer. Find implementation risks and technical complexity.",
  business:
    "You are a business analyst. Find monetization and go-to-market risks.",
};

const reviews = await Promise.all(
  Object.entries(specialistPrompts).map(async ([role, instructions]) => {
    const review = await createCompletion(getModel(), {
      instructions,
      input: productIdea,
    });

    return {
      role,
      review: review.text,
    };
  }),
);

const SynthesisSchema = z.object({
  recommendation: z.enum(["build", "research_more", "drop"]),
  reason: z.string(),
  nextSteps: z.array(z.string()),
});

const synthesis = await createParsedCompletion(getModel(), {
  instructions:
    "Synthesize the specialist reviews into one product recommendation.",
  input: JSON.stringify(reviews),
  schema: SynthesisSchema,
});

console.log(reviews);
console.log(synthesis.data);
