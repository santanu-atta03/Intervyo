class SpeechAnalyzer {
  constructor() {
    this.segments = [];
    this.fillerWords = [
      'um', 'uh', 'like', 'you know', 'basically', 'actually',
      'literally', 'kind of', 'sort of', 'i mean', 'whatever',
    ];
  }

  analyzeTranscript(transcript) {
    if (!transcript || transcript.trim().length === 0) return null;

    const lower = transcript.toLowerCase();
    const words = lower.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount === 0) return null;

    // Count filler words
    let fillerCount = 0;
    this.fillerWords.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) fillerCount += matches.length;
    });

    // Count hesitation markers
    const hesitations = (lower.match(/\.{2,}|uh+|um+|er+/g) || []).length;
    const questions = (transcript.match(/\?/g) || []).length;
    const affirmations = (lower.match(/\b(confident|absolutely|definitely|certainly|clearly|yes|sure)\b/g) || []).length;

    // Calculate confidence score (0-100)
    let score = 100;
    score -= (fillerCount / wordCount) * 100 * 2;
    score -= (hesitations / wordCount) * 100 * 1.5;
    score -= (questions / wordCount) * 100 * 1;
    score += affirmations * 5;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const level = score >= 80 ? 'very-confident' : 
                  score >= 60 ? 'confident' :
                  score >= 40 ? 'neutral' :
                  score >= 20 ? 'nervous' : 'very-nervous';

    return {
      wordCount,
      fillerWords: fillerCount,
      hesitations,
      questions,
      affirmations,
      confidenceScore: score,
      level,
      timestamp: Date.now(),
    };
  }

  addSegment(analysis) {
    if (analysis) {
      this.segments.push(analysis);
    }
  }

  getAverageConfidence() {
    if (this.segments.length === 0) return 0;
    const avg = this.segments.reduce((sum, seg) => sum + (seg.confidenceScore || 0), 0) / this.segments.length;
    return Math.round(avg);
  }

  getRating() {
    const avg = this.getAverageConfidence();
    if (avg >= 80) return 'very-confident';
    if (avg >= 60) return 'confident';
    if (avg >= 40) return 'neutral';
    if (avg >= 20) return 'nervous';
    return 'very-nervous';
  }

  reset() {
    this.segments = [];
  }
}

export default new SpeechAnalyzer();
