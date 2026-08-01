import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "名前を入力してください")
      .max(50, "名前は50文字以内で入力してください"),
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("メールアドレスの形式が正しくありません"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    password_confirmation: z.string().min(1, "確認用パスワードを入力してください"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "パスワードが一致しません",
    path: ["password_confirmation"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  comment: z
    .union([z.literal(""), z.string().max(200, "自己紹介は200文字以内で入力してください")])
    .optional(),
  portfolio_url: z
    .union([z.literal(""), z.string().url("URLの形式が正しくありません").max(255)])
    .optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;
