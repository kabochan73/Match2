function toMan(yen: number): number {
  return Math.round(yen / 10000);
}

export function formatSalaryRange(min: number | null, max: number | null): string {
  if (min === null && max === null) return "給与応相談";
  if (min !== null && max !== null) return `月給 ${toMan(min)}万円 〜 ${toMan(max)}万円`;
  if (min !== null) return `月給 ${toMan(min)}万円 〜`;
  return `〜 月給 ${toMan(max!)}万円`;
}
