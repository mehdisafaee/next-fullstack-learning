import { registerSchema } from "@/features/auth/schemas/auth.schemas";
import { registerUser } from "@/features/auth/services/auth.service";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid registration data",
            fields: z.treeifyError(result.error),
          },
        },
        { status: 400 },
      );
    }

    const user = await registerUser(result.data);

    return Response.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        {
          error: {
            code: "INVALID_JSON",
            message: "Request body must contain valid JSON",
          },
        },
        { status: 400 },
      );
    }

    return handleApiError(error);
  }
}
