import path from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "bullmq";
import { AIRESEARCH_QUEUE_NAME, connection } from "./utils/queue-config.js";
import { generatePerspective } from "./modules/research/services.js";
import "dotenv/config";
import { prisma } from "./utils/prisma.js";
import {
  getCustomerInsightResearchPrompt,
  getMarketDemandPrompt,
  getCustomerBehaviorPrompt,
  getOpportunityAndProductPrompt,
} from "./modules/research/prompts.js";
import { mkdir } from "node:fs/promises";
import { writeMarkdownPdf } from "./utils/markdown-pdf.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, "../reports");

export const worker = new Worker(
  AIRESEARCH_QUEUE_NAME,
  async (customer) => {
    console.log("WORKER: Processing customer research");

    const context = `
        Target Market: ${customer.data.targetMarket}
        Industry: ${customer.data.industry}
        Location: ${customer.data.location ?? "Not specified"}
        Additional Info: ${customer.data.additionalInfo ?? "None"}
        `;

    const currentDate = new Date().toISOString();
    const prompts = [
      getCustomerInsightResearchPrompt(currentDate),
      getMarketDemandPrompt(currentDate),
      getCustomerBehaviorPrompt(currentDate),
      getOpportunityAndProductPrompt(currentDate),
    ];

    console.log("WORKER: Prompts generated");

    let finalReport = `# Customer Insight Research Report

Analysis date: ${currentDate}

Disclaimer: This report is for informational and strategic planning purposes only. It does not constitute financial, legal, or investment advice.

`;

    for (const prompt of prompts) {
      console.log("generating for ", prompt.slice(0, 100));
      const response = await generatePerspective(context, prompt);
      finalReport += cleanMarkdownResponse(response) + "\n\n";
    }

    console.log("final report generated. length:", finalReport.length);

    await mkdir(REPORTS_DIR, { recursive: true });

    const filePath = path.join(REPORTS_DIR, `${customer.data.id}.pdf`);

    try {
      await writeMarkdownPdf(finalReport, filePath);
      console.log(`Report generated at ${filePath}`);
    } catch (error) {
      console.error(`Failed to generate report at ${filePath}`, error);
      throw error;
    }

    await prisma.customerResearch.update({
      where: {
        id: customer.data.id,
      },
      data: {
        isDone: true,
      },
    });
  },
  {
    connection,
  },
);

function cleanMarkdownResponse(markdown: string) {
  return markdown
    .replaceAll(/^```(?:markdown|md)?\s*/gim, "")
    .replaceAll(/```\s*$/gim, "")
    .replaceAll(/^#\s+.*$/gim, "")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}
