import {
  createProduct,
  getProducts,
} from "@/app/features/products/product.service";
import { createProductSchema } from "@/app/features/products/schemas";
import z from "zod";

export async function GET() {
  const products = await getProducts();

  return Response.json(products);
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

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products failed:", error);

    return Response.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 },
    );
  }
}
