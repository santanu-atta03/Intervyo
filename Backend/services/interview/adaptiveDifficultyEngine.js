const PerformanceTracker = require("../../utils/interview/performanceTracker");

/**
 * Controls interview difficulty progression
 * Difficulty scale: 1 (easy) → 5 (hard)
 */
class AdaptiveDifficultyEngine {
  constructor() {
    this.tracker = new PerformanceTracker();
    this.difficulty = 2; // start neutral
  }

  /**
   * Update difficulty based on evaluation
   * @param {"strong" | "weak" | "neutral"} evaluation
   */
  processAnswer(evaluation) {
    this.tracker.recordEvaluation(evaluation);

    const score = this.tracker.getScore();

    // Gradual promotion
    if (score >= 3 && this.difficulty < 5) {
      this.difficulty += 1;
      this.tracker.reset(); // avoid instant jumps
    }

    // Gradual simplification
    if (score <= -3 && this.difficulty > 1) {
      this.difficulty -= 1;
      this.tracker.reset();
    }
  }

  getDifficulty() {
    return this.difficulty;
  }

  /**
   * Used by question generator
   */
  shouldReframeQuestion() {
    return this.tracker.getScore() <= -3;
  }
}

module.exports = AdaptiveDifficultyEngine;
