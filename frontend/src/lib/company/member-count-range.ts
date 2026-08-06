export const MEMBER_COUNT_RANGE_OPTIONS = [
  { value: "1_10", label: "1〜10名" },
  { value: "11_50", label: "11〜50名" },
  { value: "51_100", label: "51〜100名" },
  { value: "101_300", label: "101〜300名" },
  { value: "301_plus", label: "301名以上" },
] as const;

export const MEMBER_COUNT_RANGE_VALUES = MEMBER_COUNT_RANGE_OPTIONS.map(
  (option) => option.value,
) as [string, ...string[]];

export const MEMBER_COUNT_RANGE_LABELS = Object.fromEntries(
  MEMBER_COUNT_RANGE_OPTIONS.map((option) => [option.value, option.label]),
);
