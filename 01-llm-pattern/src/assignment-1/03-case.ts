// ## Case 3
// A user gives a company name and asks for a short company profile with website and industry.

// 1. User Input: Company Name
// 2. AI search: AI searches for the information using travily.
// 3. Result with Extraction pipeline: Results are extracted using a schema to get the company name, industry, website, and a short profile.

// run: pnpm tsx src/assignment-1/03-case.ts

import { getModel, tavilyClient } from "../utils";
import { createParsedCompletion } from "@anvia/core";
import "dotenv/config";
import z from "zod";

const userInput = "Gojek";

const searchResult = await tavilyClient.search(userInput, {
  searchDepth: "basic",
});

console.log("Company name:", userInput);
console.log("Loading search results...");
// console.log("Tavily Search Result:", searchResult.results);

const CompanyInformationSchema = z.object({
  name: z.string().describe("Legal Company Name"),
  industry: z.string().describe("Company Industry"),
  website: z.string().describe("Company Website URL"),
  shortProfile: z.string().describe("Short Company Profile, including key information about the company, and write in one paragraph."),
});

const response = await createParsedCompletion(getModel(), {
  instructions:
    "Extract the key information from the web search results. If you can't find the information please return 'NONE' without quote.",
  input: `Search results: ${JSON.stringify(searchResult.results)}`,
  schema: CompanyInformationSchema,
});

console.log("Company Information:", response.data);
