
import { createCompletion } from "@anvia/core";
import "dotenv/config";
import { getModel } from "../../utils";

async function callLLM(input: string, instructions: string) {
  return createCompletion(getModel(), {
    instructions,
    input,
  });
}

// -> Extracting CV
// -> Gather context for User
// -> Scoring (Field/Industry, Level, Country)
// -> Gather context based on Score
// -> Generate PDF Report
// -> Extract PDF Report (Text) => Structured Output (For Product Frontend)

const draft = await callLLM(
  "You write concise product copy for developers.",
  "Write a two-sentence description of a TypeScript AI SDK.",
);

const edited = await callLLM(
  "You edit copy to be shorter and more specific.",
  `Tighten this draft to one sentence:\n\n${draft.text}`,
);

const translated = await callLLM(
  "You translate developer documentation accurately.",
  `Translate this sentence to Indonesian:\n\n${edited.text}`,
);

console.log(translated.text);
