"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/seeker/users";
import { applyServerValidationErrors } from "@/lib/api/validation";

type ProfileFormProps = {
  defaultValues: ProfileInput;
  onSubmit: (data: ProfileInput) => Promise<void>;
};

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
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
          名前
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="rounded border px-3 py-2"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="comment" className="text-sm font-medium">
          自己紹介
        </label>
        <textarea
          id="comment"
          rows={4}
          className="rounded border px-3 py-2"
          {...register("comment")}
        />
        {errors.comment && (
          <p className="text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="portfolio_url" className="text-sm font-medium">
          ポートフォリオURL
        </label>
        <input
          id="portfolio_url"
          type="text"
          inputMode="url"
          className="rounded border px-3 py-2"
          {...register("portfolio_url")}
        />
        {errors.portfolio_url && (
          <p className="text-sm text-red-600">{errors.portfolio_url.message}</p>
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
