import { api } from "@/lib/api/axios";
import { RegisterInput } from "../schemas/auth.schemas";
import { LoginInput } from "../schemas/login.schema";
import type { AuthUser } from "../types/auth.types";

export async function register(input: RegisterInput): Promise<AuthUser> {
  const response = await api.post<AuthUser>("/auth/register", input);
  return response.data;
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const response = await api.post<AuthUser>("/auth/login", input);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
