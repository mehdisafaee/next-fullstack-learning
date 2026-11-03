import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/features/products/product.service";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { AppError } from "@/lib/errors/app-error";
import { requireCurrentUser } from "@/features/auth/utils/require-current-user";
import { revalidateTag } from "next/cache";
import { updateProductSchema } from "@/features/products/schemas";
import { z } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await requireCurrentUser();
    const product = await getProduct(Number(id), user.id);

    if (!product) {
      throw new AppError("PRODUCT_NOT_FOUND", 404, "Product not found");
    }

    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new AppError("VALIDATION_ERROR", 400, "Invalid product ID");
    }

    const body: unknown = await request.json();
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            fields: z.treeifyError(validation.error),
          },
        },
        { status: 400 },
      );
    }

    const user = await requireCurrentUser();

    const result = await updateProduct(productId, user.id, validation.data);

    if (result.count === 0) {
      throw new AppError("PRODUCT_NOT_FOUND", 404, "Product not found");
    }

    revalidateTag(`products-${user.id}`, "max");

    const product = await getProduct(productId, user.id);

    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new AppError("VALIDATION_ERROR", 400, "Invalid product ID");
    }

    const user = await requireCurrentUser();
    const result = await deleteProduct(productId, user.id);

    if (result.count === 0) {
      throw new AppError("PRODUCT_NOT_FOUND", 404, "Product not found");
    }

    revalidateTag(`products-${user.id}`, "max");

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
