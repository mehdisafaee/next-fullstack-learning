import { z } from "zod";

import { loginSchema } from "@/features/auth/schemas/login.schema";
import { loginUser } from "@/features/auth/services/auth.service";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid login data",
            fields: z.treeifyError(result.error),
          },
        },
        { status: 400 },
      );
    }

    const { user, session } = await loginUser(result.data);

    const response = NextResponse.json(user);

    response.cookies.set("session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt,
    });

    return response;
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
