// File: src/components/Results/PDFReport.jsx
import React from 'react';

const PDFReport = ({ session, feedback, interview }) => {
  const generatePDF = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Interview Report - ${interview?.role || 'Position'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
            }
            
            .container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 36px;
              margin-bottom: 10px;
              font-weight: 700;
            }
            
            .header p {
              font-size: 18px;
              opacity: 0.9;
            }
            
            .score-section {
              text-align: center;
              padding: 50px 40px;
              background: #f8f9fa;
            }
            
            .score-circle {
              width: 200px;
              height: 200px;
              margin: 0 auto 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
            }
            
            .score-value {
              font-size: 72px;
              font-weight: 800;
              color: white;
            }
            
            .score-label {
              font-size: 24px;
              color: #666;
              margin-top: 10px;
            }
            
            .performance {
              font-size: 28px;
              font-weight: 700;
              margin-top: 15px;
              color: #667eea;
            }
            
            .content {
              padding: 40px;
            }
            
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 24px;
              font-weight: 700;
              color: #667eea;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 3px solid #667eea;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .summary {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              border-left: 5px solid #667eea;
              font-size: 16px;
              line-height: 1.8;
              color: #444;
            }
            
            .scores-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .score-card {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              text-align: center;
              border: 2px solid #e0e0e0;
            }
            
            .score-card-icon {
              font-size: 40px;
              margin-bottom: 10px;
            }
            
            .score-card-title {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
              font-weight: 600;
            }
            
            .score-card-value {
              font-size: 36px;
              font-weight: 800;
              color: #667eea;
            }
            
            .score-bar {
              height: 10px;
              background: #e0e0e0;
              border-radius: 10px;
              overflow: hidden;
              margin-top: 10px;
            }
            
            .score-bar-fill {
              height: 100%;
              background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
            }
            
            .list-item {
              background: #f8f9fa;
              padding: 20px;
              margin-bottom: 15px;
              border-radius: 10px;
              border-left: 4px solid #667eea;
              display: flex;
              align-items: flex-start;
              gap: 15px;
            }
            
            .list-item.strength {
              border-left-color: #10b981;
              background: #f0fdf4;
            }
            
            .list-item.improvement {
              border-left-color: #f59e0b;
              background: #fffbeb;
            }
            
            .list-icon {
              font-size: 24px;
              flex-shrink: 0;
            }
            
            .list-text {
              flex: 1;
              font-size: 15px;
              line-height: 1.7;
              color: #444;
            }
            
            .question-card {
              background: #f8f9fa;
              padding: 20px;
              margin-bottom: 20px;
              border-radius: 12px;
              border: 2px solid #e0e0e0;
            }
            
            .question-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            
            .question-number {
              font-weight: 700;
              color: #667eea;
              font-size: 18px;
            }
            
            .question-score {
              font-size: 32px;
              font-weight: 800;
              color: #10b981;
            }
            
            .question-text {
              font-size: 15px;
              color: #555;
              margin-bottom: 10px;
              font-weight: 600;
            }
            
            .question-answer {
              font-size: 14px;
              color: #666;
              font-style: italic;
              margin-bottom: 10px;
            }
            
            .question-feedback {
              background: white;
              padding: 15px;
              border-radius: 8px;
              font-size: 14px;
              color: #444;
              line-height: 1.6;
            }
            
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            
            .badge {
              display: inline-block;
              padding: 5px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin-left: 10px;
            }
            
            .badge.technical { background: #dbeafe; color: #1e40af; }
            .badge.behavioral { background: #d1fae5; color: #065f46; }
            .badge.coding { background: #e9d5ff; color: #6b21a8; }
            
            @media print {
              body {
                padding: 0;
                background: white;
              }
              .container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🎓 Interview Performance Report</h1>
              <p>${interview?.role || 'Position'} • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <!-- Overall Score -->
            <div class="score-section">
              <div class="score-circle">
                <div class="score-value">${feedback?.overallScore || 0}</div>
              </div>
              <div class="score-label">Overall Score (out of 100)</div>
              <div class="performance">
                ${feedback?.overallScore >= 80 ? '🌟 Excellent' : 
                  feedback?.overallScore >= 60 ? '👍 Good' : 
                  feedback?.overallScore >= 40 ? '📈 Average' : '💪 Needs Improvement'}
              </div>
            </div>
            
            <!-- Content -->
            <div class="content">
              <!-- Summary -->
              <div class="section">
                <div class="section-title">
                  <span>💬</span>
                  Overall Summary
                </div>
                <div class="summary">
                  ${feedback?.summary || 'Great job completing the interview! You demonstrated strong communication skills and technical knowledge.'}
                </div>
              </div>
              
              <!-- Score Breakdown -->
              <div class="section">
                <div class="section-title">
                  <span>📊</span>
                  Score Breakdown
                </div>
                <div class="scores-grid">
                  <div class="score-card">
                    <div class="score-card-icon">💻</div>
                    <div class="score-card-title">Technical</div>
                    <div class="score-card-value">${feedback?.technicalScore || 0}</div>
                    <div class="score-bar">
                      <div class="score-bar-fill" style="width: ${(feedback?.technicalScore || 0) * 10}%"></div>
                    </div>
                  </div>
                  <div class="score-card">
                    <div class="score-card-icon">💬</div>
                    <div class="score-card-title">Communication</div>
                    <div class="score-card-value">${feedback?.communicationScore || 0}</div>
                    <div class="score-bar">
                      <div class="score-bar-fill" style="width: ${(feedback?.communicationScore || 0) * 10}%"></div>
                    </div>
                  </div>
                  <div class="score-card">
                    <div class="score-card-icon">🧩</div>
                    <div class="score-card-title">Problem Solving</div>
                    <div class="score-card-value">${feedback?.problemSolvingScore || 0}</div>
                    <div class="score-bar">
                      <div class="score-bar-fill" style="width: ${(feedback?.problemSolvingScore || 0) * 10}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Strengths -->
              <div class="section">
                <div class="section-title">
                  <span>💪</span>
                  Key Strengths
                </div>
                ${(feedback?.strengths || ['Strong technical knowledge', 'Clear communication', 'Good problem-solving']).map(strength => `
                  <div class="list-item strength">
                    <div class="list-icon">✓</div>
                    <div class="list-text">${strength}</div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Improvements -->
              <div class="section">
                <div class="section-title">
                  <span>📈</span>
                  Areas for Improvement
                </div>
                ${(feedback?.improvements || ['Practice coding', 'More detailed explanations', 'Review fundamentals']).map(improvement => `
                  <div class="list-item improvement">
                    <div class="list-icon">→</div>
                    <div class="list-text">${improvement}</div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Questions Analysis -->
              ${session?.questionEvaluations && session.questionEvaluations.length > 0 ? `
                <div class="section">
                  <div class="section-title">
                    <span>❓</span>
                    Question-by-Question Analysis
                  </div>
                  ${session.questionEvaluations.map((evalua, index) => `
                    <div class="question-card">
                      <div class="question-header">
                        <div>
                          <span class="question-number">Question ${index + 1}</span>
                          <span class="badge ${evalua.category}">${evalua.category}</span>
                        </div>
                        <div class="question-score">${evalua.score}/10</div>
                      </div>
                      <div class="question-text">${evalua.question}</div>
                      <div class="question-answer">"${evalua.answer?.substring(0, 150)}..."</div>
                      <div class="question-feedback">
                        <strong>Feedback:</strong> ${evalua.feedback}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p><strong>Thank you for using our AI Interview Platform!</strong></p>
              <p>Keep practicing and improving. Good luck with your future interviews! 🚀</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">
                Generated on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      <span>📄</span>
      <span>Download PDF Report</span>
    </button>
  );
};

export default PDFReport;