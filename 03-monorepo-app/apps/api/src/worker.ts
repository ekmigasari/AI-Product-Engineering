import { Worker } from "bullmq";
import { QUEUE_NAME, connection } from "./utils/queue-config.js";
import { generateResearch } from "./modules/research/services.js";
import { prisma } from "./utils/prisma.js";

export const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log("WORKER: Processing customer research");

    const response = await generateResearch(job.data);

    await prisma.customerResearch.update({
      where: {
        id: job.data.id,
      },
      data: {
        isDone: true,
        perspective: response.perspective,
      },
    });
  },
  {
    connection,
  },
);
