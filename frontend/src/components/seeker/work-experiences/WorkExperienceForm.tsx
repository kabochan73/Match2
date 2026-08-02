"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  workExperienceSchema,
  type WorkExperienceInput,
} from "@/lib/seeker/work-experiences/schemas";
import { applyServerValidationErrors } from "@/lib/api/validation";

type WorkExperienceFormProps = {
  defaultValues?: WorkExperienceInput;
  submitLabel: string;
  onSubmit: (data: WorkExperienceInput) => Promise<unknown>;
  onCancel?: () => void;
};

const emptyValues: WorkExperienceInput = {
  company_name: "",
  started_on: "",
  ended_on: "",
  employment_type: "",
};

export function WorkExperienceForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: WorkExperienceFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkExperienceInput>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const submit = handleSubmit(async (data) => {
    setFormError(null);
    try {
      await onSubmit(data);
      if (!defaultValues) reset(emptyValues);
    } catch (error) {
      const message = applyServerValidationErrors(error, setError);
      if (message) setFormError(message);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="flex w-full max-w-sm flex-col gap-4">
      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="company_name" className="text-sm font-medium">
          会社名
        </label>
        <input
          id="company_name"
          type="text"
          className="rounded border px-3 py-2"
          {...register("company_name")}
        />
        {errors.company_name && (
          <p className="text-sm text-red-600">{errors.company_name.message}</p>
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

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="started_on" className="text-sm font-medium">
            開始日
          </label>
          <input
            id="started_on"
            type="date"
            className="rounded border px-3 py-2"
            {...register("started_on")}
          />
          {errors.started_on && (
            <p className="text-sm text-red-600">{errors.started_on.message}</p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="ended_on" className="text-sm font-medium">
            終了日
          </label>
          <input
            id="ended_on"
            type="date"
            className="rounded border px-3 py-2"
            {...register("ended_on")}
          />
          {errors.ended_on && (
            <p className="text-sm text-red-600">{errors.ended_on.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-4 py-2"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
