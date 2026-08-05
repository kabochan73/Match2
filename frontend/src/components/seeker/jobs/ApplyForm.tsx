"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyLikeSchema, type ApplyLikeInput, LIKE_TYPE_LABELS } from "@/lib/seeker/likes/schemas";
import { applyServerValidationErrors } from "@/lib/api/validation";
import { ApiError } from "@/lib/api/errors";
import type { LikeRemaining } from "@/lib/api/types";

type ApplyFormProps = {
  onSubmit: (data: ApplyLikeInput) => Promise<unknown>;
  remaining?: LikeRemaining;
};

export function ApplyForm({ onSubmit, remaining }: ApplyFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplyLikeInput>({
    resolver: zodResolver(applyLikeSchema),
    defaultValues: { like_type: "standard", motivation: "" },
  });

  const selectedLikeType = watch("like_type");
  const selectedRemaining = remaining?.[selectedLikeType]?.remaining;
  const isLimitReached = selectedRemaining === 0;

  const submit = handleSubmit(async (data) => {
    setFormError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      // job_posting_id errors (already applied, job not published) have no
      // matching form field, so surface them as a form-level message.
      if (error instanceof ApiError && error.status === 422) {
        const body = error.body as { errors?: Record<string, string[]> } | null;
        const jobPostingError = body?.errors?.job_posting_id?.[0];
        if (jobPostingError) {
          setFormError(jobPostingError);
          return;
        }
      }
      const message = applyServerValidationErrors(error, setError);
      if (message) setFormError(message);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">この求人に応募する</h2>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="standard"
            disabled={remaining?.standard.remaining === 0}
            {...register("like_type")}
          />
          {LIKE_TYPE_LABELS.standard}
          {remaining && <span className="text-gray-500">(残り{remaining.standard.remaining}件)</span>}
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="super"
            disabled={remaining?.super.remaining === 0}
            {...register("like_type")}
          />
          {LIKE_TYPE_LABELS.super}
          {remaining && <span className="text-gray-500">(残り{remaining.super.remaining}件)</span>}
        </label>
      </div>
      {errors.like_type && <p className="text-sm text-red-600">{errors.like_type.message}</p>}
      {isLimitReached && (
        <p className="text-sm text-red-600">
          今月の{LIKE_TYPE_LABELS[selectedLikeType]}の上限に達しています。
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="motivation" className="text-sm font-medium">
          志望動機
        </label>
        <textarea
          id="motivation"
          rows={4}
          className="rounded border px-3 py-2 text-sm"
          {...register("motivation")}
        />
        {errors.motivation && (
          <p className="text-sm text-red-600">{errors.motivation.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLimitReached}
        className="w-fit rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isSubmitting ? "応募中..." : "応募する"}
      </button>
    </form>
  );
}
