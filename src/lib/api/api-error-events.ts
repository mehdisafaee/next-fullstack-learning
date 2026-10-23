export type ApiErrorEventDetail = {
  title: string;
  message: string;
};

export const API_ERROR_EVENT = "api-error";

export function dispatchApiError(detail: ApiErrorEventDetail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<ApiErrorEventDetail>(API_ERROR_EVENT, {
      detail,
    }),
  );
}
