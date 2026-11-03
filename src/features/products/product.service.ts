import prisma from "@/lib/prisma";
import { CreateProductInput, UpdateProductInput } from "./schemas";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedProducts(userId: string) {
  "use cache";

  cacheLife("hours");
  cacheTag(`products-${userId}`);

  return prisma.product.findMany({
    where: { userId },
  });
}
export function getProduct(id: number, userId: string) {
  return prisma.product.findFirst({
    where: {
      id,
      userId,
    },
  });
}
export function createProduct(input: CreateProductInput, userId: string) {
  return prisma.product.create({
    data: {
      ...input,
      userId,
    },
  });
}

export function updateProduct(
  id: number,
  userId: string,
  input: UpdateProductInput,
) {
  return prisma.product.updateMany({
    where: {
      id,
      userId,
    },
    data: input,
  });
}

export function deleteProduct(id: number, userId: string) {
  return prisma.product.deleteMany({
    where: {
      id,
      userId,
    },
  });
}
