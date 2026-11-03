import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
