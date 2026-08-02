import { z } from "zod";

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "正社員" },
  { value: "part_time", label: "アルバイト・パート" },
  { value: "contract", label: "契約社員" },
] as const;

const EMPLOYMENT_TYPE_VALUES = EMPLOYMENT_TYPE_OPTIONS.map((option) => option.value);

export const workExperienceSchema = z
  .object({
    company_name: z
      .string()
      .min(1, "会社名を入力してください")
      .max(255, "会社名は255文字以内で入力してください"),
    started_on: z.string().min(1, "開始日を入力してください"),
    ended_on: z.union([z.literal(""), z.string()]).optional(),
    employment_type: z
      .string()
      .refine((value) => (EMPLOYMENT_TYPE_VALUES as readonly string[]).includes(value), {
        message: "雇用形態を選択してください",
      }),
  })
  .refine((data) => !data.ended_on || data.ended_on >= data.started_on, {
    message: "終了日は開始日以降にしてください",
    path: ["ended_on"],
  });

export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
