export function generateCertificate(session, feedback) {
  const certificateId = `CERT-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)
    .toUpperCase()}`;
  const verificationCode = Math.random()
    .toString(36)
    .slice(2, 14)
    .toUpperCase();
  const issuedAt = new Date();
  const validUntil = new Date(issuedAt);
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const interview = session.interviewId || {};
  const config = interview.config || {};
  const score = feedback.overallScore;

  return {
    certificateId,
    issuedAt,
    validUntil,
    verificationCode,
    shareableLink: `${
      process.env.FRONTEND_URL || ""
    }/certificates/${certificateId}`,
    userName: session.userId?.name || "Candidate",
    interviewType: (
      config.interviewType ||
      interview.interviewType ||
      "Interview"
    ).toUpperCase(),
    domain:
      interview.role ||
      config.subDomain ||
      config.domain ||
      "Interview",
    score,
    grade:
      score >= 90
        ? "A"
        : score >= 80
          ? "B"
          : score >= 70
            ? "C"
            : "D",
  };
}
