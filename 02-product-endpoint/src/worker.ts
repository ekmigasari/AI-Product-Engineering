import { Worker } from "bullmq";
import { AIRESEARCH_QUEUE_NAME, connection } from "./utils/queue-config.js";
import { generatePerspective } from "./modules/research/services.js";
import "dotenv/config";
import { prisma } from "./utils/prisma.js";
import {
  getCareerPivotingPrompt,
  getJobReportPrompt,
  getMarketDemandPrompt,
  getMotivationAndConsequencePrompt,
} from "../src/modules/research/prompts.js";
import { mkdir } from "node:fs/promises";
import { writeMarkdownPdf } from "./utils/markdown-pdf.js";

export const worker = new Worker(
  AIRESEARCH_QUEUE_NAME,
  async (job) => {
    const context = `
        Job Title: ${job.data.jobTitle}
        Level: ${job.data.level}
        Industry: ${job.data.industry}
        Additional Info: ${job.data.additionalInfo}
        `;

    const currentDate = new Date().toISOString();
    const prompts = [
      getJobReportPrompt(currentDate),
      getMarketDemandPrompt(currentDate),
      getCareerPivotingPrompt(currentDate),
      getMotivationAndConsequencePrompt(currentDate),
    ];

    let finalVerdicts = "";

    for (const prompt of prompts) {
      console.log("generating for ", prompt.slice(0, 100));
      const response = await generatePerspective(context, prompt);
      finalVerdicts += response + "\n\n";
    }

    console.log("final verdicts");
    console.log(finalVerdicts);

    await mkdir("reports", { recursive: true });

    const filePath = `reports/${job.data.id}.pdf`;

    try {
      await writeMarkdownPdf(finalVerdicts, filePath);
      console.log(`Report generated at ${filePath}`);
    } catch (error) {
      console.error(`Failed to generate report at ${filePath}`, error);
      throw error;
    }

    // console.log(context);
    // const response = await generatePerspective(context);
    // console.log(response);
    // console.log("job completed");
    // await prisma.research.update({
    //   where: {
    //     id: job.data.id,
    //   },
    //   data: {
    //     isDone: true,
    //   },
    // });
  },
  {
    connection,
  },
);
