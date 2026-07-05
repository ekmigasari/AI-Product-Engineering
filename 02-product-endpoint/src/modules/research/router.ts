import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CustomerResearchRequestSchema } from "./schema.js";
import { aiResearchQueue } from "../../utils/queue.js";
import { prisma } from "../../utils/prisma.js";

export const researchRouter = new Hono()
  .get("/", async (c) => {
    const customerResearches = await prisma.customerResearch.findMany();
    return c.json(customerResearches);
  })
  .post("/", zValidator("json", CustomerResearchRequestSchema), async (c) => {
    const body = c.req.valid("json");
    const { targetMarket, industry, location, additionalInfo } = body;

    const newCustomerResearch = await prisma.customerResearch.create({
      data: {
        targetMarket,
        industry,
        location,
        additionalInfo,
      },
    });

    console.log("ROUTER: input data saved to database");

    await aiResearchQueue.add("customerResearch", newCustomerResearch);

    return c.json({
      message: "ROUTER: Customer  Research is on queue",
      customerResearchId: newCustomerResearch.id,
    });
  });
