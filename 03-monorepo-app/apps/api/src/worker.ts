import { Worker } from "bullmq";
import { connection, QUEUE_NAME } from "./config/queue-connection.js";

export const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    // Doing what ???
  },
  {
    connection: connection,
  },
);
