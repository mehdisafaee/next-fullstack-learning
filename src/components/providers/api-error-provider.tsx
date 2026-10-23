"use client";

import {
  API_ERROR_EVENT,
  ApiErrorEventDetail,
} from "@/lib/api/api-error-events";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ApiErrorMessage = {
  title: string;
  message: string;
};

type ApiErrorContextValue = {
  showApiError: (error: ApiErrorMessage) => void;
};

const ApiErrorContext = createContext<ApiErrorContextValue | null>(null);

export function ApiErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ApiErrorMessage | null>(null);

  const showApiError = useCallback((nextError: ApiErrorMessage) => {
    setError(nextError);
  }, []);

  useEffect(() => {
    function handleApiError(event: Event) {
      const customEvent = event as CustomEvent<ApiErrorEventDetail>;
      showApiError(customEvent.detail);
    }

    window.addEventListener(API_ERROR_EVENT, handleApiError);

    return () => {
      window.removeEventListener(API_ERROR_EVENT, handleApiError);
    };
  }, [showApiError]);

  return (
    <ApiErrorContext.Provider value={{ showApiError }}>
      {children}

      {error && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setError(null)}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="api-error-title"
            aria-describedby="api-error-message"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="api-error-title"
              className="mb-2 text-xl font-semibold text-red-700"
            >
              {error.title}
            </h2>

            <p id="api-error-message" className="mb-6 text-gray-700">
              {error.message}
            </p>

            <button
              type="button"
              autoFocus
              onClick={() => setError(null)}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </ApiErrorContext.Provider>
  );
}

export function useApiError() {
  const context = useContext(ApiErrorContext);

  if (!context) {
    throw new Error("useApiError must be used within ApiErrorProvider");
  }

  return context;
}
