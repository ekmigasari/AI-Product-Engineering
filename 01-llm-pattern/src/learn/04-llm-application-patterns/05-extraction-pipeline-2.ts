import { getModel, tavilyClient } from "../../utils";
import { createParsedCompletion } from "@anvia/core";
import "dotenv/config";
import z from "zod";

const SearchQueriesSchema = z.object({
  queries: z.array(z.string()),
});

const userInput = "PT Ultra Sakti";

const SYSTEM_PROMPT = `
  You are an expert in company research, What you need to find is detailed company informations
  including the company's name, industry, location, and any other relevant details.

  Generate 5 most important query to be searched in google to get the most detailed information about the company.
  `;

const response = await createParsedCompletion(getModel(), {
  instructions: SYSTEM_PROMPT,
  input: `User input: ${userInput}`,
  schema: SearchQueriesSchema,
});

console.log(response.data.queries);

const data = await Promise.all(
  response.data.queries.map(async (query) => {
    const searchResult = await tavilyClient.search(query, {
      searchDepth: "basic",
    });
    return searchResult;
  }),
);

console.log(data);

// Looping to be extracted by multiple schema

// Company Information
// Product and Services
// Board of director and Founders
// Financial Information
// News and Updates

// const CompanyInformationSchema = z.object({
//   name: z.string().describe("Legal Company Name"),
//   slogan: z.string().describe("Company Slogan"),
//   address: z.string().describe("Company Address"),
//   website: z.string().describe("Company Website URL"),
//   stockTicker: z.string().describe("Company Stock Ticker"),
// });

// const response = await createParsedCompletion(getModel(), {
//   instructions:
//     "Extract the key information from the web search results, if you can't find the information please return 'NONE' without quote.",
//   input: `Search results: ${JSON.stringify(searchResult.results)}`,
//   schema: CompanyInformationSchema,
// });

// console.log(response.data);
