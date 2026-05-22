import { z } from "zod";
import { db } from "./db";

export const templateInputSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  content: z.string().min(1),
  variables: z.array(z.string()).optional()
});

export const templateUpdateSchema = templateInputSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided"
  });

export type TemplateInput = z.infer<typeof templateInputSchema>;
export type TemplateUpdateInput = z.infer<typeof templateUpdateSchema>;

export async function listTemplates(userId: string) {
  return db.template.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }]
  });
}

export async function getTemplateById(userId: string, id: string) {
  return db.template.findFirst({
    where: { id, userId }
  });
}

export async function createTemplate(userId: string, input: TemplateInput) {
  const data = templateInputSchema.parse(input);

  return db.template.create({
    data: {
      userId,
      name: data.name,
      category: data.category,
      content: data.content,
      variables: data.variables ?? []
    }
  });
}

export async function updateTemplate(userId: string, id: string, input: TemplateUpdateInput) {
  const data = templateUpdateSchema.parse(input);

  const existing = await db.template.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    return null;
  }

  const updated = await db.template.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      category: data.category ?? existing.category,
      content: data.content ?? existing.content,
      ...(data.variables !== undefined ? { variables: data.variables } : {})
    }
  });

  return updated;
}

