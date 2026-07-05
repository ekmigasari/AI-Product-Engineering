# Devscale Indonesia Bootcamp: AI Product Engineering Common Pattern

This repository contains common LLM application patterns for the Devscale Indonesia Bootcamp AI Product Engineering program. The examples use Anvia with OpenAI-compatible model calls, plus Tavily for search-based workflows.

## Topics

- Prompt chaining
- Prompt routing
- Context injection
- Extraction pipelines
- Evaluator and optimizer loops
- Parallel fan-out and fan-in
- Plan and execute workflows
- Agentic decision making

## Requirements

- Node.js
- pnpm
- OpenAI API key
- Tavily API key for search examples

## Setup

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in the required values:

```env
OPENAI_API_KEY=
OPENROUTER_API_KEY=
MINIMAX_API_KEY=
TAVILY_API_KEY=
```

`OPENAI_API_KEY` is required for the OpenAI examples. `TAVILY_API_KEY` is required for examples that perform web search.

## Run Examples

Run any TypeScript example with `tsx`:

```bash
pnpm tsx src/learn/04-llm-application/patterns/01-prompt-chaining.ts
pnpm tsx src/learn/04-llm-application/patterns/02-prompt-router.ts
pnpm tsx src/learn/04-llm-application/patterns/03-context-injection.ts
pnpm tsx src/learn/04-llm-application/patterns/04-extraction-pipeline.ts
pnpm tsx src/learn/04-llm-application/patterns/05-extraction-pipeline-2.ts
pnpm tsx src/learn/04-llm-application/patterns/06-evaluator-optimizer.ts
pnpm tsx src/learn/04-llm-application/patterns/07-parallel-fanout-fanin.ts
pnpm tsx src/learn/04-llm-application/patterns/08-plan-and-execute.ts
pnpm tsx src/learn/04-llm-application/patterns/09-agentic-decision.ts
```

## Project Structure

```text
src/learn/04-llm-application/patterns
  01-prompt-chaining.ts
  02-prompt-router.ts
  03-context-injection.ts
  04-extraction-pipeline.ts
  05-extraction-pipeline-2.ts
  06-evaluator-optimizer.ts
  07-parallel-fanout-fanin.ts
  08-plan-and-execute.ts
  09-agentic-decision.ts
```

`src/utils.ts` centralizes the model client and Tavily client used across the examples.


## Rules of Thumb
Need facts? Context injection or research pipeline
Need fields? Structured extraction
Need stages? Prompt chaining or plan-and-execute
Need categories? Prompt routing
Need action choice? Agent action decision
Need quality checks? Evaluator and opti mizer
Need many views? Parallel fanout and fani n
Need safety? Guard rail and esc alation
Need long input? Map-reduce summarization