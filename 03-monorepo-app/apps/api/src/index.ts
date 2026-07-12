import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { researchRouter } from "./modules/research/router.js";
import { cors } from "hono/cors";
import { chatRouter } from "./modules/chat/router.js";

const app = new Hono()
  .use(cors())
  .route("/research", researchRouter)
  .route("/chat", chatRouter);

// type utility -> helper
export type AppType = typeof app;

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
