import { z } from "zod";

export const educationSchema = z.object({
  school_name: z
    .string()
    .min(1, "学校名を入力してください")
    .max(255, "学校名は255文字以内で入力してください"),
});

export type EducationInput = z.infer<typeof educationSchema>;
