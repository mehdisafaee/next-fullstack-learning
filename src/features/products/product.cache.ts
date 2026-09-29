import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

export async function getCachedProducts() {
  "use cache";

  cacheTag("products");

  return prisma.product.findMany();
}
