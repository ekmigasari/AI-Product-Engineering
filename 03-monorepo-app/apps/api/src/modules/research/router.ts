import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateResearchSchema } from "./schema.js";
import { researchQueue } from "../../utils/queue.js";
import { prisma } from "../../utils/prisma.js";

export const researchRouter = new Hono()
  .get("/", async (c) => {
    const customerResearches = await prisma.customerResearch.findMany();
    return c.json(customerResearches);
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const research = await prisma.customerResearch.findUnique({ where: { id } });
    if (!research) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(research);
  })
  .post("/", zValidator("json", CreateResearchSchema), async (c) => {
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

    await researchQueue.add("customerResearch", newCustomerResearch);

    return c.json({
      message: "ROUTER: Customer  Research is on queue",
      customerResearchId: newCustomerResearch.id,
    });
  });
