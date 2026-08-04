import { z } from "zod";

export const LIKE_STATUS_LABELS = {
  applied: "応募中",
  matched: "マッチ成立",
  expired: "期限切れ",
} as const;

export const LIKE_TYPE_LABELS = {
  standard: "通常いいね",
  super: "スーパーいいね",
} as const;

export const applyLikeSchema = z.object({
  like_type: z.enum(["standard", "super"]),
  motivation: z.string().min(1, "志望動機を入力してください"),
});

export type ApplyLikeInput = z.infer<typeof applyLikeSchema>;
