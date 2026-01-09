/**
 * Tracks candidate performance during interview
 * Score range: -5 (weak) → +5 (strong)
 */
class PerformanceTracker {
  constructor() {
    this.score = 0;
  }

  recordEvaluation(result) {
    if (result === "strong") {
      this.score += 1;
    }

    if (result === "weak") {
      this.score -= 1;
    }

    // Prevent runaway scores
    this.score = Math.max(-5, Math.min(5, this.score));
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = 0;
  }
}

module.exports = PerformanceTracker;
