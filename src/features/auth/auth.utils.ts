import { createHash } from "node:crypto";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
  };
}
