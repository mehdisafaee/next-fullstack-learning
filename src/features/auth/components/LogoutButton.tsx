"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/api/auth.api";
export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  async function handleLogout() {
    setIsLoggingOut(true);
    setError("");
    try {
      await logout();
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    } catch {
      setError("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  }
  return (
    <div>
      {" "}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {" "}
        {isLoggingOut ? "Logging out..." : "Log out"}{" "}
      </button>{" "}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {" "}
          {error}{" "}
        </p>
      )}{" "}
    </div>
  );
}
