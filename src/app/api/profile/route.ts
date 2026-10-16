import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/features/auth/require-current-user";
import { handleApiError } from "@/lib/errors/handle-api-error";

export async function GET() {
  try {
    const user = await requireCurrentUser();

    // Only authenticated users reach this point.
    return NextResponse.json({
      message: "Your profile",
      user,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
