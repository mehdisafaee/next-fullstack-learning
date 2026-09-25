import { AppError } from "./app-error";

export function handleApiError(error: unknown) {
  console.error(error);

  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      {
        status: error.status,
      },
    );
  }

  return Response.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    },
    {
      status: 500,
    },
  );
}
