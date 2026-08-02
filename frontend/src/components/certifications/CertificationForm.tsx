"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  certificationSchema,
  type CertificationInput,
} from "@/lib/certifications/schemas";
import { applyServerValidationErrors } from "@/lib/api/validation";

type CertificationFormProps = {
  defaultValues?: CertificationInput;
  submitLabel: string;
  onSubmit: (data: CertificationInput) => Promise<unknown>;
  onCancel?: () => void;
};

const emptyValues: CertificationInput = {
  name: "",
};

export function CertificationForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: CertificationFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationInput>({
    resolver: zodResolver(certificationSchema),
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
        <label htmlFor="name" className="text-sm font-medium">
          資格名
        </label>
        <input
          id="name"
          type="text"
          className="rounded border px-3 py-2"
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
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
