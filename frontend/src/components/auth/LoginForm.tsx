"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/auth/schemas";
import { applyServerValidationErrors } from "@/lib/api/validation";

type LoginFormProps = {
  onSubmit: (data: LoginInput) => Promise<void>;
  registerHref: string;
  forgotPasswordHref: string;
};

export function LoginForm({
  onSubmit,
  registerHref,
  forgotPasswordHref,
}: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

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
        <label htmlFor="password" className="text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="rounded border px-3 py-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "ログイン中..." : "ログイン"}
      </button>

      <div className="flex justify-between text-sm">
        <Link href={forgotPasswordHref} className="underline">
          パスワードをお忘れの方
        </Link>
        <Link href={registerHref} className="underline">
          新規登録はこちら
        </Link>
      </div>
    </form>
  );
}
