"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { login as loginUser } from "@/features/auth/api/auth.api";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login.schema";
import type { ApiError } from "@/lib/api/types";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setServerError("");

    try {
      await loginUser(data);
      router.replace("/products");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        const code = error.response?.data?.error?.code;

        if (code === "INVALID_CREDENTIALS") {
          setServerError("Invalid email or password.");
          return;
        }

        if (code === "VALIDATION_ERROR") {
          setServerError("Please check your email and password.");
          return;
        }
      }

      setServerError("Login failed. Please try again.");
    }
  }

  return (
    <main className="mx-auto mt-12 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block">
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
            className="w-full rounded border p-2"
          />

          {errors.email && (
            <p role="alert" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
            className="w-full rounded border p-2"
          />

          {errors.password && (
            <p role="alert" className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
