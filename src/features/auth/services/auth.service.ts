import argon2 from "argon2";

import prisma from "@/lib/prisma";
import { RegisterInput } from "../schemas/auth.schemas";
import { AppError } from "@/lib/errors/app-error";
import { LoginInput } from "../schemas/login.schema";
import { createSession } from "./session.service";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError(
      "EMAIL_ALREADY_REGISTERED",
      409,
      "An account with this email already exists",
    );
  }

  const passwordHash = await argon2.hash(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", 401, "Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    input.password,
  );

  if (!isPasswordValid) {
    throw new AppError("INVALID_CREDENTIALS", 401, "Invalid email or password");
  }

  const session = await createSession(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    session,
  };
}
