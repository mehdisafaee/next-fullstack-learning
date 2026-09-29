import prisma from "@/lib/prisma";
import { CreateProductInput } from "./schemas";

export function getProducts() {
  return prisma.product.findMany();
}

export function getProduct(id: number) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export function createProduct(input: CreateProductInput) {
  return prisma.product.create({
    data: input,
  });
}
