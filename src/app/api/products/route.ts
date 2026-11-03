import { requireCurrentUser } from "@/features/auth/utils/require-current-user";
import {
  createProduct,
  getCachedProducts,
} from "@/features/products/product.service";
import { createProductSchema } from "@/features/products/schemas";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const products = await getCachedProducts(user.id);

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

    const user = await requireCurrentUser();
    const product = await createProduct(result.data, user.id);

    revalidateTag(`products-${user.id}`, "max");

    return Response.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
