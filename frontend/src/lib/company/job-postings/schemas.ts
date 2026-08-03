import { z } from "zod";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import { PREFECTURES } from "@/lib/prefectures";

const EMPLOYMENT_TYPE_VALUES = EMPLOYMENT_TYPE_OPTIONS.map((option) => option.value);

export const JOB_POSTING_STATUS_LABELS = {
  draft: "下書き",
  published: "公開中",
  unpublished: "非公開",
  closed: "募集終了",
} as const;

const salaryField = z
  .union([z.literal(""), z.string().regex(/^\d+$/, "半角数字で入力してください")])
  .optional();

export const jobPostingSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(255, "タイトルは255文字以内で入力してください"),
    description: z.string().min(1, "仕事内容を入力してください"),
    desired_candidate: z.union([z.literal(""), z.string()]).optional(),
    employment_type: z
      .string()
      .refine((value) => (EMPLOYMENT_TYPE_VALUES as readonly string[]).includes(value), {
        message: "雇用形態を選択してください",
      }),
    prefecture: z
      .string()
      .refine((value) => (PREFECTURES as readonly string[]).includes(value), {
        message: "都道府県を選択してください",
      }),
    salary_min: salaryField,
    salary_max: salaryField,
  })
  .refine(
    (data) =>
      data.salary_min === "" ||
      data.salary_max === "" ||
      data.salary_min === undefined ||
      data.salary_max === undefined ||
      Number(data.salary_max) >= Number(data.salary_min),
    {
      message: "上限は下限以上にしてください",
      path: ["salary_max"],
    },
  );

export type JobPostingInput = z.infer<typeof jobPostingSchema>;
