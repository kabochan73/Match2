"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema, type UserRegisterInput } from "@/lib/seeker/users";
import { applyServerValidationErrors } from "@/lib/api/validation";

type RegisterFormProps = {
  onSubmit: (data: UserRegisterInput) => Promise<void>;
  loginHref: string;
};

export function RegisterForm({ onSubmit, loginHref }: RegisterFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterInput>({ resolver: zodResolver(userRegisterSchema) });

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
        <label htmlFor="email" className="text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded border px-3 py-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="birth_date" className="text-sm font-medium">
          生年月日
        </label>
        <input
          id="birth_date"
          type="date"
          className="rounded border px-3 py-2"
          {...register("birth_date")}
        />
        {errors.birth_date && (
          <p className="text-sm text-red-600">{errors.birth_date.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="rounded border px-3 py-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password_confirmation" className="text-sm font-medium">
          パスワード(確認用)
        </label>
        <input
          id="password_confirmation"
          type="password"
          autoComplete="new-password"
          className="rounded border px-3 py-2"
          {...register("password_confirmation")}
        />
        {errors.password_confirmation && (
          <p className="text-sm text-red-600">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "登録中..." : "登録する"}
      </button>

      <p className="text-sm">
        すでにアカウントをお持ちの方は{" "}
        <Link href={loginHref} className="underline">
          ログイン
        </Link>
      </p>
    </form>
  );
}
