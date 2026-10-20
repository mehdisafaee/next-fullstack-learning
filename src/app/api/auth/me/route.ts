import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/features/auth/utils/require-current-user";
import { handleApiError } from "@/lib/errors/handle-api-error";

export async function GET() {
  try {
    const user = await requireCurrentUser();

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
