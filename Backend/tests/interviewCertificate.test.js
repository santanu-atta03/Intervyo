import { generateCertificate } from "../utils/interviewCertificate.js";

describe("interview certificate generation", () => {
  test("uses the configured interview fields when legacy fields are absent", () => {
    const certificate = generateCertificate(
      {
        userId: {},
        interviewId: {
          config: {
            domain: "backend",
            subDomain: "Node.js",
            interviewType: "technical",
            difficulty: "hard",
          },
        },
      },
      { overallScore: 85 },
    );

    expect(certificate).toMatchObject({
      userName: "Candidate",
      interviewType: "TECHNICAL",
      domain: "Node.js",
      score: 85,
      grade: "B",
    });
    expect(certificate.certificateId).toMatch(/^CERT-/);
  });
});
