import { getModel, tavilyClient } from "../../utils";
import { createParsedCompletion } from "@anvia/core";
import "dotenv/config";
import z from "zod";

const searchResult = await tavilyClient.search("Bank Central Asia", {
  searchDepth: "basic",
});

const CompanyInformationSchema = z.object({
  name: z.string().describe("Legal Company Name"),
  slogan: z.string().describe("Company Slogan"),
  address: z.string().describe("Company Address"),
  website: z.string().describe("Company Website URL"),
  stockTicker: z.string().describe("Company Stock Ticker"),
});

const response = await createParsedCompletion(getModel(), {
  instructions:
    "Extract the key information from the web search results, if you can't find the information please return 'NONE' without quote.",
  input: `Search results: ${JSON.stringify(searchResult.results)}`,
  schema: CompanyInformationSchema,
});

console.log(response.data);
