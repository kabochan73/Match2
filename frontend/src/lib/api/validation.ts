import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "./errors";

type LaravelValidationErrorBody = {
  message: string;
  errors?: Record<string, string[]>;
};

function fallbackErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "通信エラーが発生しました。しばらくしてから再度お試しください。";
  }

  if (error.status === 422) {
    const body = error.body as LaravelValidationErrorBody | null;
    return body?.message ?? "入力内容を確認してください。";
  }

  return "エラーが発生しました。しばらくしてから再度お試しください。";
}

/**
 * Maps a Laravel 422 validation error onto react-hook-form fields.
 * Returns a form-level message for non-field errors (network failure,
 * 500s, or a 422 body with no `errors` map); returns null once all
 * errors have been attached inline to fields.
 */
export function applyServerValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  if (error instanceof ApiError && error.status === 422) {
    const body = error.body as LaravelValidationErrorBody | null;
    const fieldErrors = Object.entries(body?.errors ?? {});

    if (fieldErrors.length > 0) {
      for (const [field, messages] of fieldErrors) {
        setError(field as Path<T>, { type: "server", message: messages[0] });
      }
      return null;
    }
  }

  return fallbackErrorMessage(error);
}

/**
 * Same message mapping as applyServerValidationErrors, for mutations with
 * no react-hook-form fields to attach errors to (e.g. a plain send/match
 * button rather than a validated form).
 */
export function getErrorMessage(error: unknown): string {
  return fallbackErrorMessage(error);
}
