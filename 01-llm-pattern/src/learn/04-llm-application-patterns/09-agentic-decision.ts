import z from "zod";
import { createCompletion, createParsedCompletion } from "@anvia/core";
import { getModel, tavilyClient } from "../../utils";

const userInput =
  "Can you check the latest pricing of Notion AI and compare it with ChatGPT Plus?";

const ActionDecisionSchema = z.object({
  action: z.enum([
    "answer_directly",
    "search_web",
    "ask_clarifying_question",
    "handoff",
  ]),
  reason: z.string(),
  searchQueries: z
    .array(z.string())
    .describe("Only fill this when action is search_web"),
  question: z
    .string()
    .describe("Only fill this when action is ask_clarifying_question"),
});

const decision = await createParsedCompletion(getModel(), {
  instructions: `
    Decide the next action before answering the user.

    Use answer_directly when the request can be answered from general knowledge.
    Use search_web when the request needs current or external information.
    Use ask_clarifying_question when an important requirement is missing.
    Use handoff when the request needs a human, account access, or a risky guarantee.

    Return 1 or 2 search queries only when search_web is needed.
    Ask one short question only when ask_clarifying_question is needed.
  `,
  input: `User request: ${userInput}`,
  schema: ActionDecisionSchema,
});

console.log(decision.data);

if (decision.data.action === "ask_clarifying_question") {
  // Send email ?
  // Send slack ?

  console.log(decision.data.question);
} else if (decision.data.action === "handoff") {
  // Create task on Backlog ?
  // Notify Internal Team ?

  console.log(
    "This needs a human or account-specific support. I will hand it off.",
  );
} else if (decision.data.action === "search_web") {
  const searchResults = await Promise.all(
    decision.data.searchQueries.map(async (query) => {
      return tavilyClient.search(query);
    }),
  );

  const answer = await createCompletion(getModel(), {
    instructions:
      "Answer using the search results. Compare only what the results support. If pricing is unclear, say what is missing.",
    input: `User request: ${userInput}

Search results:
${JSON.stringify(searchResults)}`,
  });

  console.log(answer.text);
} else {
  const answer = await createCompletion(getModel(), {
    instructions: "Answer the user directly. Keep it short and practical.",
    input: userInput,
  });

  console.log(answer.text);
}
