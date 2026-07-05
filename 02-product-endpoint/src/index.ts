import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { researchRouter } from "./modules/research/router.js";

const app = new Hono().route("/research", researchRouter);

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
