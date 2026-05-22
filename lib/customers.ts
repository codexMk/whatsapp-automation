import { z } from "zod";
import { db } from "./db";

export const customerInputSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  tags: z.array(z.string()).optional()
});

export const customerUpdateSchema = customerInputSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided"
  });

export type CustomerInput = z.infer<typeof customerInputSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;

export async function listCustomers(userId: string) {
  return db.customer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function getCustomerById(userId: string, id: string) {
  return db.customer.findFirst({
    where: { id, userId }
  });
}

export async function createCustomer(userId: string, input: CustomerInput) {
  const data = customerInputSchema.parse(input);

  return db.customer.create({
    data: {
      userId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      tags: data.tags ?? []
    }
  });
}

export async function updateCustomer(userId: string, id: string, input: CustomerUpdateInput) {
  const data = customerUpdateSchema.parse(input);

  const existing = await db.customer.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    return null;
  }

  const updated = await db.customer.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      phone: data.phone ?? existing.phone,
      email: data.email ?? existing.email,
      tags: data.tags ?? existing.tags
    }
  });

  return updated;
}

