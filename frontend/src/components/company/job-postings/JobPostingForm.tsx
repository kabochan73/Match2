"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostingSchema, type JobPostingInput } from "@/lib/company/job-postings/schemas";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import { PREFECTURE_OPTIONS } from "@/lib/prefectures";
import { applyServerValidationErrors } from "@/lib/api/validation";

type JobPostingFormProps = {
  defaultValues?: JobPostingInput;
  submitLabel: string;
  onSubmit: (data: JobPostingInput) => Promise<unknown>;
};

const emptyValues: JobPostingInput = {
  title: "",
  description: "",
  desired_candidate: "",
  employment_type: "",
  prefecture: "",
  salary_min: "",
  salary_max: "",
};

export function JobPostingForm({ defaultValues, submitLabel, onSubmit }: JobPostingFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JobPostingInput>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const submit = handleSubmit(async (data) => {
    setFormError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      const message = applyServerValidationErrors(error, setError);
      if (message) setFormError(message);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="flex w-full max-w-sm flex-col gap-4">
      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          className="rounded border px-3 py-2"
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          仕事内容
        </label>
        <textarea
          id="description"
          rows={6}
          className="rounded border px-3 py-2"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="desired_candidate" className="text-sm font-medium">
          求める人物像
        </label>
        <textarea
          id="desired_candidate"
          rows={4}
          className="rounded border px-3 py-2"
          {...register("desired_candidate")}
        />
        {errors.desired_candidate && (
          <p className="text-sm text-red-600">{errors.desired_candidate.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="employment_type" className="text-sm font-medium">
          雇用形態
        </label>
        <select
          id="employment_type"
          className="rounded border px-3 py-2"
          defaultValue=""
          {...register("employment_type")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.employment_type && (
          <p className="text-sm text-red-600">{errors.employment_type.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="prefecture" className="text-sm font-medium">
          都道府県
        </label>
        <select
          id="prefecture"
          className="rounded border px-3 py-2"
          defaultValue=""
          {...register("prefecture")}
        >
          <option value="" disabled>
            選択してください
          </option>
          {PREFECTURE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.prefecture && (
          <p className="text-sm text-red-600">{errors.prefecture.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="salary_min" className="text-sm font-medium">
            給与下限(月給・万円)
          </label>
          <input
            id="salary_min"
            type="number"
            min={0}
            className="rounded border px-3 py-2"
            {...register("salary_min")}
          />
          {errors.salary_min && (
            <p className="text-sm text-red-600">{errors.salary_min.message}</p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="salary_max" className="text-sm font-medium">
            給与上限(月給・万円)
          </label>
          <input
            id="salary_max"
            type="number"
            min={0}
            className="rounded border px-3 py-2"
            {...register("salary_max")}
          />
          {errors.salary_max && (
            <p className="text-sm text-red-600">{errors.salary_max.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "保存中..." : submitLabel}
      </button>
    </form>
  );
}
