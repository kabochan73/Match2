"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyLikeSchema, type ApplyLikeInput, LIKE_TYPE_LABELS } from "@/lib/seeker/likes/schemas";
import { applyServerValidationErrors } from "@/lib/api/validation";
import { ApiError } from "@/lib/api/errors";

type ApplyFormProps = {
  onSubmit: (data: ApplyLikeInput) => Promise<unknown>;
};

export function ApplyForm({ onSubmit }: ApplyFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplyLikeInput>({
    resolver: zodResolver(applyLikeSchema),
    defaultValues: { like_type: "standard", motivation: "" },
  });

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
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 rounded border p-4">
      <h2 className="text-lg font-medium">この求人に応募する</h2>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input type="radio" value="standard" {...register("like_type")} />
          {LIKE_TYPE_LABELS.standard}
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" value="super" {...register("like_type")} />
          {LIKE_TYPE_LABELS.super}
        </label>
      </div>
      {errors.like_type && <p className="text-sm text-red-600">{errors.like_type.message}</p>}

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
        disabled={isSubmitting}
        className="w-fit rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isSubmitting ? "応募中..." : "応募する"}
      </button>
    </form>
  );
}
