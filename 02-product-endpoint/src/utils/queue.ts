import { Queue } from "bullmq";
import { connection, AIRESEARCH_QUEUE_NAME } from "./queue-config.js";

export const aiResearchQueue = new Queue(AIRESEARCH_QUEUE_NAME, { connection });
