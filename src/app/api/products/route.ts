import {
  createProduct,
  getProducts,
} from "@/features/products/product.service";
import { createProductSchema } from "@/features/products/schemas";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { updateTag } from "next/cache";
import { z } from "zod";

export async function GET() {
  try {
    const products = await getProducts();

    return Response.json(products);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            fields: z.treeifyError(result.error),
          },
        },
        { status: 400 },
      );
    }

    const product = await createProduct(result.data);

    updateTag("products");

    return Response.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
