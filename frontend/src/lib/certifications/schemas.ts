import { z } from "zod";

export const certificationSchema = z.object({
  name: z
    .string()
    .min(1, "資格名を入力してください")
    .max(255, "資格名は255文字以内で入力してください"),
});

export type CertificationInput = z.infer<typeof certificationSchema>;
