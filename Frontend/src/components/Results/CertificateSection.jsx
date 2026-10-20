import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  Check,
  Copy,
  Download,
  ExternalLink,
  Facebook,
  Linkedin,
  QrCode,
  ShieldCheck,
  Twitter,
} from "lucide-react";
import { useSelector } from "react-redux";

import "../../styles/resultsComponents.css";
const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CertificateSection = ({
  certificate,
  summary = {},
  config = {},
  completedAt,
}) => {
  const [copied, setCopied] = useState(false);
  const { user } = useSelector((state) => state.profile);

  if (!certificate) {
    return (
      <section className="results-component certificate-empty">
        <div className="certificate-empty-icon">
          <Award size={28} />
        </div>

        <h3>Certificate unavailable</h3>

        <p>
          A certificate has not been generated for this interview yet.
        </p>
      </section>
    );
  }

  const certificateId = certificate.certificateId || "Not available";
  const verificationCode =
    certificate.verificationCode || "Not available";
  const shareableLink = certificate.shareableLink || "";
  const recipientName = user?.name || "Interview candidate";

  const interviewType = config.interviewType
    ? config.interviewType.toUpperCase()
    : "AI";

  const interviewName = [
    config.domain,
    config.subDomain,
  ]
    .filter(Boolean)
    .join(" · ") || "Interview";

  const handleCopyLink = async () => {
    if (!shareableLink) return;

    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch (error) {
      console.error("Failed to copy certificate link:", error);
    }
  };

  const handleShare = (platform) => {
    if (!shareableLink) return;

    const shareText = `I completed a ${config.domain || "professional"} interview and scored ${
      summary.overallScore || 0
    }/100.`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareableLink,
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText,
      )}&url=${encodeURIComponent(shareableLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareableLink,
      )}`,
    };

    window.open(
      shareUrls[platform],
      "_blank",
      "width=640,height=480,noopener,noreferrer",
    );
  };

  const handleDownload = () => {
    if (!shareableLink) {
      window.print();
      return;
    }

    window.open(
      shareableLink,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <motion.section
      className="results-component certificate-section"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="certificate-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <Award size={18} />
        </span>

        <div>
          <h3 id="certificate-heading">
            Achievement certificate
          </h3>

          <p className="results-component-subtitle">
            Your verified record of interview completion and performance.
          </p>
        </div>
      </div>

      <motion.div
        className="certificate-preview"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="certificate-preview-inner">
          <div className="certificate-preview-top">
            <span className="certificate-mark">
              <Award size={24} />
            </span>

            <span className="certificate-verified">
              <ShieldCheck size={14} />
              Verified completion
            </span>
          </div>

          <div className="certificate-preview-content">
            <div className="certificate-eyebrow">
              Intervyo performance record
            </div>

            <h2>Certificate of completion</h2>

            <p className="certificate-presented">
              This certifies that
            </p>

            <div className="certificate-recipient">
              {recipientName}
            </div>

            <p className="certificate-description">
              successfully completed a {interviewType} interview for{" "}
              <strong>{interviewName}</strong>.
            </p>

            <div className="certificate-score-row">
              <div className="certificate-score">
                <strong>{summary.overallScore || 0}</strong>
                <span>Score / 100</span>
              </div>

              <div className="certificate-score-details">
                <CertificateMetric
                  label="Grade"
                  value={summary.grade || "N/A"}
                />

                <CertificateMetric
                  label="Percentile"
                  value={
                    summary.percentile
                      ? `${summary.percentile}th`
                      : "N/A"
                  }
                />

                <CertificateMetric
                  label="Difficulty"
                  value={config.difficulty || "N/A"}
                />
              </div>
            </div>
          </div>

          <div className="certificate-preview-footer">
            <span>
              <CalendarDays size={14} />
              {formatDate(completedAt)}
            </span>

            <span>
              <ShieldCheck size={14} />
              {certificateId.slice(0, 16)}
              {certificateId.length > 16 ? "…" : ""}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="certificate-detail-grid">
        <CertificateDetail
          icon={ShieldCheck}
          label="Certificate ID"
          value={certificateId}
        />

        <CertificateDetail
          icon={CalendarDays}
          label="Issued on"
          value={formatDate(certificate.issuedAt)}
        />

        <CertificateDetail
          icon={Check}
          label="Valid until"
          value={formatDate(certificate.validUntil)}
        />

        <CertificateDetail
          icon={QrCode}
          label="Verification code"
          value={verificationCode}
        />
      </div>

      <motion.section
        className="certificate-share"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="certificate-section-heading">
          <div>
            <h4>Share your achievement</h4>
            <p>
              Share a public verification link for your certificate.
            </p>
          </div>
        </div>

        <div className="certificate-share-row">
          <input
            type="text"
            value={shareableLink}
            readOnly
            aria-label="Certificate share link"
            placeholder="Share link unavailable"
          />

          <button
            type="button"
            className="certificate-copy-button"
            onClick={handleCopyLink}
            disabled={!shareableLink}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy link
              </>
            )}
          </button>
        </div>

        <div className="certificate-socials">
          <ShareButton
            icon={Facebook}
            label="Facebook"
            onClick={() => handleShare("facebook")}
            disabled={!shareableLink}
          />

          <ShareButton
            icon={Twitter}
            label="Twitter"
            onClick={() => handleShare("twitter")}
            disabled={!shareableLink}
          />

          <ShareButton
            icon={Linkedin}
            label="LinkedIn"
            onClick={() => handleShare("linkedin")}
            disabled={!shareableLink}
          />
        </div>
      </motion.section>

      <div className="certificate-actions">
        <button
          type="button"
          className="results-btn results-btn-primary"
          onClick={handleDownload}
        >
          <Download size={16} />
          View certificate
        </button>

        <button
          type="button"
          className="results-btn results-btn-secondary"
          onClick={() => {
            if (shareableLink) {
              window.open(
                shareableLink,
                "_blank",
                "noopener,noreferrer",
              );
            }
          }}
          disabled={!shareableLink}
        >
          <ExternalLink size={16} />
          Public certificate
        </button>
      </div>

      <div className="certificate-verification-note">
        <ShieldCheck size={17} />

        <p>
          Anyone can verify this certificate using its certificate ID or
          verification code. It confirms interview completion and the
          recorded performance score.
        </p>
      </div>
    </motion.section>
  );
};

function CertificateMetric({ label, value }) {
  return (
    <div className="certificate-score-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CertificateDetail({ icon: Icon, label, value }) {
  return (
    <motion.div
      className="certificate-detail"
      whileHover={{ y: -3 }}
    >
      <span className="certificate-detail-icon">
        <Icon size={17} />
      </span>

      <div>
        <span className="certificate-detail-label">
          {label}
        </span>
        <strong>{value}</strong>
      </div>
    </motion.div>
  );
}

function ShareButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      className="certificate-social-button"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default CertificateSection;