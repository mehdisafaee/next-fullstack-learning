import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

import prisma from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
