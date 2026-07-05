import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ResearchRequestSchema } from "./schema.js";
import { aiResearchQueue } from "../../utils/queue.js";
import { prisma } from "../../utils/prisma.js";

export const researchRouter = new Hono()
  .get("/", async (c) => {
    const researchs = await prisma.research.findMany();
    return c.json(researchs);
  })
  .post("/", zValidator("json", ResearchRequestSchema), async (c) => {
    const body = c.req.valid("json");
    const { jobTitle, level, industry, additionalInfo } = body;

    const newResearch = await prisma.research.create({
      data: {
        jobTitle,
        level,
        industry,
        additionalInfo,
      },
    });

    await aiResearchQueue.add("research", newResearch);

    return c.json({
      message: "Research is on queue",
      researchId: newResearch.id,
    });
  });
