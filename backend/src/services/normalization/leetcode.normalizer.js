export function normalizeLeetCode(data) {
  return {
    platform: "LEETCODE",
    totalSolved: data.totalSolved,
    solvedToday: null, // not available yet
    difficulty: {
      easy: data.easySolved,
      medium: data.mediumSolved,
      hard: data.hardSolved
    },
    ranking: data.ranking,
    reputation: data.reputation
  };
}
