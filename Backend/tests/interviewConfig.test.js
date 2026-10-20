import {
  calculateInterviewPlan,
  getInterviewDetails,
} from "../utils/interviewConfig.js";

describe("interview configuration", () => {
  test("reads settings saved by the interview setup flow", () => {
    const interview = {
      config: {
        domain: "backend",
        subDomain: "Node.js",
        difficulty: "hard",
        duration: 45,
        targetCompany: "Example",
        interviewType: "technical",
      },
    };

    expect(getInterviewDetails(interview)).toEqual({
      role: "Node.js",
      difficulty: "hard",
      duration: 45,
      targetCompany: "Example",
      interviewType: "technical",
    });
  });

  test("retains support for interviews using legacy top-level settings", () => {
    expect(
      getInterviewDetails({
        role: "Frontend Engineer",
        difficulty: "easy",
        duration: 15,
        targetCompany: "Example",
        interviewType: "behavioral",
      }),
    ).toEqual({
      role: "Frontend Engineer",
      difficulty: "easy",
      duration: 15,
      targetCompany: "Example",
      interviewType: "behavioral",
    });
  });

  test("builds a finite question plan from configured interview duration", () => {
    const plan = calculateInterviewPlan({
      config: {
        difficulty: "medium",
        duration: 30,
        interviewType: "behavioral",
      },
    });

    expect(plan).toEqual({
      totalQuestions: 10,
      technical: 0,
      behavioral: 10,
      coding: 0,
    });
  });
});
