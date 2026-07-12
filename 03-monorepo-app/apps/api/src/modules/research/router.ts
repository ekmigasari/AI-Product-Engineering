import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateResearchSchema } from "./schema.js";

export const researchRouter = new Hono()
  .get("/", async (c) => {
    return c.json({ message: "OK", appName: "API" });
  })
  .post("/", zValidator("json", CreateResearchSchema), async (c) => {
    const body = c.req.valid("json");
    console.log(body);

    return c.json({ message: "OK", appName: "API" });
  });
