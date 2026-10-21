import { Suspense } from "react";
import { redirect } from "next/navigation";

import { requireCurrentUser } from "@/features/auth/utils/require-current-user";
import { AppError } from "@/lib/errors/app-error";

async function DashboardContent() {
  let user;
  try {
    user = await requireCurrentUser();
  } catch (error) {
    if (error instanceof AppError && error.code === "UNAUTHORIZED") {
      redirect("/login");
    }

    throw error;
  }
  return (
    <main className="mx-auto mt-12 max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

      <p className="text-gray-600">Welcome back, {user.email}!</p>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}
