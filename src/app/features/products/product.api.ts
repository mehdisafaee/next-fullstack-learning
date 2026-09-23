import { api } from "@/lib/api/axios";
import type { Product } from "./types";
import { CreateProductInput } from "./schemas";

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products");

  return response.data;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const response = await api.post<Product>("/products", input);

  return response.data;
}
