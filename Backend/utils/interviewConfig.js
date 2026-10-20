const DIFFICULTY_SETTINGS = {
  easy: {
    avgTimePerQuestion: 2.5,
    technicalRatio: 0.4,
    behavioralRatio: 0.3,
    codingRatio: 0.3,
    minQuestionsPerCategory: 2,
  },
  medium: {
    avgTimePerQuestion: 3,
    technicalRatio: 0.45,
    behavioralRatio: 0.25,
    codingRatio: 0.3,
    minQuestionsPerCategory: 3,
  },
  hard: {
    avgTimePerQuestion: 3.5,
    technicalRatio: 0.5,
    behavioralRatio: 0.2,
    codingRatio: 0.3,
    minQuestionsPerCategory: 3,
  },
};

export function getInterviewDetails(interview) {
  const config = interview?.config || {};

  return {
    role:
      interview?.role ||
      config.subDomain ||
      config.domain ||
      "Software Engineer",
    difficulty: interview?.difficulty || config.difficulty || "medium",
    duration: Number(interview?.duration ?? config.duration) || 30,
    targetCompany:
      interview?.targetCompany || config.targetCompany || "",
    interviewType:
      config.interviewType || interview?.interviewType || "mixed",
  };
}

export function calculateInterviewPlan(interview) {
  const { difficulty, duration, interviewType } = getInterviewDetails(interview);
  const settings =
    DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.medium;
  const totalQuestions = Math.max(
    1,
    Math.floor(duration / settings.avgTimePerQuestion),
  );

  if (interviewType === "behavioral") {
    return { totalQuestions, technical: 0, behavioral: totalQuestions, coding: 0 };
  }
  if (interviewType === "coding") {
    return { totalQuestions, technical: 0, behavioral: 0, coding: totalQuestions };
  }
  if (interviewType === "technical" || interviewType === "system-design") {
    return { totalQuestions, technical: totalQuestions, behavioral: 0, coding: 0 };
  }

  const plan = {
    totalQuestions,
    technical: Math.max(
      settings.minQuestionsPerCategory,
      Math.floor(totalQuestions * settings.technicalRatio),
    ),
    behavioral: Math.max(
      settings.minQuestionsPerCategory,
      Math.floor(totalQuestions * settings.behavioralRatio),
    ),
    coding: Math.max(
      settings.minQuestionsPerCategory,
      Math.floor(totalQuestions * settings.codingRatio),
    ),
  };

  const sum = plan.technical + plan.behavioral + plan.coding;
  if (sum > totalQuestions) {
    const diff = sum - totalQuestions;
    plan.behavioral -= Math.floor(diff / 2);
    plan.technical -= Math.ceil(diff / 2);
  }

  return plan;
}
