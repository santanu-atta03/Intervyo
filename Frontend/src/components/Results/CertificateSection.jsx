// components/results/CertificateSection.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Download, Share2, Check, Copy, ExternalLink,
  Calendar, Shield, QrCode, Facebook, Twitter, Linkedin
} from 'lucide-react';


const CertificateSection = ({ certificate, summary, config, completedAt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificate.shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const text = `I just completed a ${config.domain} interview and scored ${summary.overallScore}/100! Check out my certificate:`;
    const url = certificate.shareableLink;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleDownload = () => {
    // This would trigger certificate generation and download
    console.log('Downloading certificate...');
    alert('Certificate download will be implemented');
  };

  return (
    <div className="certificate-section">
      {/* Header */}
      <motion.div
        className="certificate-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Award className="w-8 h-8 text-yellow-500" />
        <div>
          <h2>Your Achievement Certificate</h2>
          <p>Congratulations on completing the interview!</p>
        </div>
      </motion.div>

      {/* Certificate Preview */}
      <motion.div
        className="certificate-preview"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="certificate-background">
          <div className="cert-pattern"></div>
          <div className="cert-content">
            <div className="cert-badge">
              <Award className="w-16 h-16" />
            </div>
            
            <h3 className="cert-title">Certificate of Completion</h3>
            
            <p className="cert-subtitle">This is to certify that</p>
            
            <div className="cert-recipient">
              <span className="recipient-name">{certificate.userName}</span>
            </div>
            
            <p className="cert-description">
              has successfully completed the {config.interviewType.toUpperCase()} interview
              in {config.domain} - {config.subDomain}
            </p>
            
            <div className="cert-score-display">
              <div className="score-circle">
                <span className="score-value">{summary.overallScore}</span>
                <span className="score-label">Score</span>
              </div>
              <div className="score-details">
                <div className="score-item">
                  <span className="label">Grade:</span>
                  <span className="value">{summary.grade}</span>
                </div>
                <div className="score-item">
                  <span className="label">Percentile:</span>
                  <span className="value">{summary.percentile}th</span>
                </div>
                <div className="score-item">
                  <span className="label">Difficulty:</span>
                  <span className="value">{config.difficulty}</span>
                </div>
              </div>
            </div>
            
            <div className="cert-footer">
              <div className="cert-date">
                <Calendar className="w-4 h-4" />
                <span>{new Date(completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="cert-id">
                <Shield className="w-4 h-4" />
                <span>ID: {certificate.certificateId.slice(0, 16)}...</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Certificate Details */}
      <motion.div
        className="certificate-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="detail-card">
          <Shield className="w-6 h-6 text-blue-500" />
          <div className="detail-content">
            <h4>Certificate ID</h4>
            <p>{certificate.certificateId}</p>
          </div>
        </div>

        <div className="detail-card">
          <Calendar className="w-6 h-6 text-green-500" />
          <div className="detail-content">
            <h4>Issued On</h4>
            <p>{new Date(certificate.issuedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="detail-card">
          <Check className="w-6 h-6 text-purple-500" />
          <div className="detail-content">
            <h4>Valid Until</h4>
            <p>{new Date(certificate.validUntil).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="detail-card">
          <QrCode className="w-6 h-6 text-orange-500" />
          <div className="detail-content">
            <h4>Verification Code</h4>
            <p className="verification-code">{certificate.verificationCode}</p>
          </div>
        </div>
      </motion.div>

      {/* Share Section */}
      <motion.div
        className="share-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>Share Your Achievement</h3>
        
        <div className="share-link-box">
          <input
            type="text"
            value={certificate.shareableLink}
            readOnly
            className="share-input"
          />
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="share-buttons">
          <button
            className="share-btn facebook"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="w-5 h-5" />
            Facebook
          </button>
          <button
            className="share-btn twitter"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </button>
          <button
            className="share-btn linkedin"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="certificate-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="action-btn primary" onClick={handleDownload}>
          <Download className="w-5 h-5" />
          Download Certificate
        </button>
        <button className="action-btn secondary" onClick={() => window.open(certificate.shareableLink, '_blank')}>
          <ExternalLink className="w-5 h-5" />
          View Public Certificate
        </button>
      </motion.div>

      {/* Verification Info */}
      <motion.div
        className="verification-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Shield className="w-5 h-5 text-blue-500" />
        <p>
          This certificate can be verified by anyone using the certificate ID or verification code.
          It proves your completion of the interview and your achieved score.
        </p>
      </motion.div>
    </div>
  );
};

export default CertificateSection;