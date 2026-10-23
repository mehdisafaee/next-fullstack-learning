import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/features/auth/utils/require-current-user";
import LogoutButton from "@/features/auth/components/LogoutButton";
export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireCurrentUser().catch((error: unknown) => {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "UNAUTHORIZED"
    ) {
      redirect("/login");
    }
    throw error;
  });
  return (
    <>
      <header className="flex items-center justify-between border-b p-4">
        <span>{user.email}</span> <LogoutButton />
      </header>
      {children}
    </>
  );
}
