import { AppError } from "@/lib/errors/app-error";
import { getCurrentUser } from "./auth.utils";

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AppError("UNAUTHORIZED", 401, "You must be logged in");
  }

  return user;
}
