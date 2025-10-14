import mongoose from 'mongoose';
import { mailSender } from '../config/email.js';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires after 5 minutes
  },
});

// Email template
const otpEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #667eea;">InterviewPro</h1>
          <p>Verify Your Email Address</p>
        </div>
        <p>Hello,</p>
        <p>Thank you for registering with Intervyo! Please use the following OTP to complete your registration:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
          <p>© 2024 Intervyo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send verification email before saving
otpSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      await mailSender(
        this.email,
        'Email Verification - Intervyo',
        otpEmailTemplate(this.otp)
      );
      console.log('OTP email sent successfully to:', this.email);
    }
    next();
  } catch (error) {
    console.error('Error sending OTP email:', error);
    next(error);
  }
});

export default mongoose.model('OTP', otpSchema);