import prisma from "@/lib/prisma";

export function getProducts() {
  return prisma.product.findMany();
}
