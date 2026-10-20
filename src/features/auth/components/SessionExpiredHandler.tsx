"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionExpiredHandler() {
  const [expired, setExpired] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleSessionExpired() {
      setExpired(true);

      if (timerRef.current) return;

      timerRef.current = setTimeout(() => {
        router.push("/login");
      }, 5000);
    }

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  if (!expired) return null;

  return (
    <div role="alert" className="bg-red-100 p-4 text-red-800">
      Your session has expired. Redirecting to login in 5 seconds...
    </div>
  );
}
