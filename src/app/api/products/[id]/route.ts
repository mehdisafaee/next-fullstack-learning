import { getProduct } from "@/features/products/product.service";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { AppError } from "@/lib/errors/app-error";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await getProduct(Number(id));

    if (!product) {
      throw new AppError("PRODUCT_NOT_FOUND", 404, "Product not found");
    }

    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}
