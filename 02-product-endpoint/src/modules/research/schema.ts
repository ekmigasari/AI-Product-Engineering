import z from "zod";

export const CustomerResearchRequestSchema = z.object({
  targetMarket: z.string().min(1),
  industry: z.string().min(1),
  location: z.string().optional(),
  additionalInfo: z.string().optional(),
});
