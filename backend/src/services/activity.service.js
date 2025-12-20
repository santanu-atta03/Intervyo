export function computeActivityScore(normalized) {
  // MVP logic: any activity = 1
  if (normalized.totalSolved > 0) return 1;
  return 0;
}
