import { Queue } from "bullmq";
import { connection, QUEUE_NAME } from "./queue-config.js";

export const researchQueue = new Queue(QUEUE_NAME, {
  connection: connection,
});
