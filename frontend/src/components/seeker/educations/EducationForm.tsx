"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, type EducationInput } from "@/lib/educations/schemas";
import { applyServerValidationErrors } from "@/lib/api/validation";

type EducationFormProps = {
  defaultValues?: EducationInput;
  submitLabel: string;
  onSubmit: (data: EducationInput) => Promise<unknown>;
  onCancel?: () => void;
};

const emptyValues: EducationInput = {
  school_name: "",
};

export function EducationForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
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
        <label htmlFor="school_name" className="text-sm font-medium">
          学校名
        </label>
        <input
          id="school_name"
          type="text"
          className="rounded border px-3 py-2"
          {...register("school_name")}
        />
        {errors.school_name && (
          <p className="text-sm text-red-600">{errors.school_name.message}</p>
        )}
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
