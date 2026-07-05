import z from "zod";

export const ResearchRequestSchema = z.object({
  jobTitle: z.string().min(1),
  level: z.string().min(1),
  industry: z.string().min(1),
  additionalInfo: z.string().optional(),
});
