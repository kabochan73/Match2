"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyProfileSchema, type CompanyProfileInput } from "@/lib/auth/companies";
import { PREFECTURE_OPTIONS } from "@/lib/prefectures";
import { applyServerValidationErrors } from "@/lib/api/validation";

type CompanyProfileFormProps = {
  defaultValues: CompanyProfileInput;
  onSubmit: (data: CompanyProfileInput) => Promise<void>;
};

export function CompanyProfileForm({ defaultValues, onSubmit }: CompanyProfileFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyProfileInput>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues,
  });

  const submit = handleSubmit(async (data) => {
    setFormError(null);
    setSaved(false);
    try {
      await onSubmit(data);
      setSaved(true);
    } catch (error) {
      const message = applyServerValidationErrors(error, setError);
      if (message) setFormError(message);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="flex w-full max-w-sm flex-col gap-4">
      {formError && <p className="text-sm text-red-600">{formError}</p>}
      {saved && <p className="text-sm text-green-600">保存しました</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          会社名
        </label>
        <input
          id="name"
          type="text"
          autoComplete="organization"
          className="rounded border px-3 py-2"
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          会社紹介
        </label>
        <textarea
          id="description"
          rows={4}
          className="rounded border px-3 py-2"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone_number" className="text-sm font-medium">
          電話番号
        </label>
        <input
          id="phone_number"
          type="tel"
          autoComplete="tel"
          className="rounded border px-3 py-2"
          {...register("phone_number")}
        />
        {errors.phone_number && (
          <p className="text-sm text-red-600">{errors.phone_number.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="prefecture" className="text-sm font-medium">
          都道府県
        </label>
        <select
          id="prefecture"
          className="rounded border px-3 py-2"
          {...register("prefecture")}
        >
          <option value="">選択してください</option>
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

      <div className="flex flex-col gap-1">
        <label htmlFor="address_line" className="text-sm font-medium">
          住所
        </label>
        <input
          id="address_line"
          type="text"
          autoComplete="street-address"
          className="rounded border px-3 py-2"
          {...register("address_line")}
        />
        {errors.address_line && (
          <p className="text-sm text-red-600">{errors.address_line.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
