"use client";

import { api } from "@/lib/api/axios";

export default function TestSessionPage() {
  async function testSession() {
    try {
      const response = await api.get("/auth/me");
      alert(`Authenticated: ${response.data.user.email}`);
    } catch {
      alert("Request failed. Check the session notification.");
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Session Test</h1>

      <button
        onClick={testSession}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Test Session
      </button>
    </main>
  );
}
