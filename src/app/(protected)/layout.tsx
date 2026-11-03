import AuthenticatedLayout from "@/features/auth/components/AuthenticatedLayout";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}
