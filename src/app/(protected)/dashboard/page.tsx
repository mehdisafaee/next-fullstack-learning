import { Suspense } from "react";

async function DashboardContent() {
  return (
    <main className="mx-auto mt-12 max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

      <p className="text-gray-600">Welcome to your dashboard!</p>
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
