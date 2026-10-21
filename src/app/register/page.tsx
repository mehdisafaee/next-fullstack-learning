"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { register as registerUser } from "@/features/auth/api/auth.api";
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/auth.schemas";
import type { ApiError } from "@/lib/api/types";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError("");

    try {
      await registerUser(data);
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        const code = error.response?.data?.error?.code;

        if (code === "EMAIL_ALREADY_REGISTERED") {
          setError("email", {
            type: "server",
            message: "An account with this email already exists.",
          });
          return;
        }

        if (code === "VALIDATION_ERROR") {
          setServerError("Please check your information and try again.");
          return;
        }
      }

      setServerError("Registration failed. Please try again.");
    }
  }

  return (
    <main className="mx-auto mt-12 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Create an account</h1>

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
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className="w-full rounded border p-2"
          />

          {errors.email && (
            <p id="email-error" role="alert" className="text-sm text-red-600">
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
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            className="w-full rounded border p-2"
          />

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-red-600"
            >
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
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
}
