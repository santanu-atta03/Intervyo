import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import OTP from "../models/Otp.model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { authLogger } from "../utils/logger.js";
dotenv.config();

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        loading: false,
        loading: false,
    user.loading = false;
      user.loading = false;
      user.loading = false;
      user.loading = false;
      user.loading = false;
      user.loading = false;
    user.loading = false;
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let existingOTP = await OTP.findOne({ otp });
    while (existingOTP) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existingOTP = await OTP.findOne({ otp });
    }

    await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find existing OTP for this email
    const existingOTP = await OTP.findOne({ email });

    if (!existingOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found for this email. Please request a new OTP.",
      });
    }

    // Generate new 6-digit OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure OTP uniqueness
    let duplicateOTP = await OTP.findOne({ otp });
    while (duplicateOTP) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      duplicateOTP = await OTP.findOne({ otp });
    }

    // Update existing OTP document with new OTP and reset expiry
    existingOTP.otp = otp;
    existingOTP.createdAt = Date.now();
    await existingOTP.save(); // Triggers post-save hook to send email

    res.status(200).json({
      success: true,
      message: "OTP resent successfully to your email",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

// Register with OTP verification and auto profile creation
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, otp } = req.body;

//     if (!name || !email || !password || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     // Verify OTP
//     const recentOTP = await OTP.findOne({ email })
//       .sort({ createdAt: -1 })
//       .limit(1);

//     if (!recentOTP) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found. Please request a new one.",
//       });
//     }

//     if (recentOTP.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // Create empty profile first
//     const newProfile = await Profile.create({
//       phone: null,
//       gender: null,
//       age: null,
//       bio: null,
//       location: null,
//       domain: null,
//       experience: null,
//       skills: [],
//       linkedIn: null,
//       github: null,
//       portfolio: null,
//       education: [],
//       certificates: [],
//       achievements: [],
//     });
//     // Create user with profile reference
//     const user = await User.create({
//       name,
//       email,
//       password,
//       authProvider: "local",
//       isVerified: true,
//       profile : newProfile._id,
//     });

//     // Generate token
//     const token = user.generateAuthToken();

//     // Delete used OTP
//     await OTP.deleteOne({ _id: recentOTP._id });

//     // Fetch complete user data with profile
//     const completeUser = await User.findById(user._id)
//       .select('-password -resetPasswordToken -resetPasswordExpire')
//       .populate('profile');

//     res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       token,
//       user: completeUser,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// };

// controllers/Auth.controller.js - register function
export const register = async (req, res) => {
  try {
    const { name, email, password, otp, profilePicture, profile: profileData } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Verify OTP
    const recentOTP = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    if (recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Generate unique avatar if not provided
    const finalProfilePicture = profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    // Step 1: Create user first (but not saved yet)
    const user = new User({
      name: name.trim(),
      email,
      password,
      authProvider: "local",
      isVerified: true,
      profilePicture: finalProfilePicture,
    });

    // Step 2: Create profile and assign user
    const profile = await Profile.create({
      user: user._id, 
      phone: null,
      gender: null,
      age: null,
      bio: null,
      location: null,
      domain: profileData?.domain || null,
      experience: profileData?.experience || null,
      skills: [],
      linkedIn: null,
      github: null,
      portfolio: null,
      education: [],
      certificates: [],
      achievements: [],
    });

    // Step 3: Save user with profile reference
    user.profile = profile._id;
    await user.save(); 

    // Generate token
    const token = user.generateAuthToken();

    // Delete used OTP
    await OTP.deleteOne({ _id: recentOTP._id });

    // Fetch complete user data with populated profile
    const completeUser = await User.findById(user._id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile")
      .exec();
    

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: completeUser,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// controllers/Auth.controller.js - login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and populate profile
    const user = await User.findOne({ email })
      .select("+password") 
      .populate({
        path: "profile",
        select: "-__v",
      });

    if (!user) {
      authLogger.warn("Login Failed: User not found", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      authLogger.warn("Login Failed: Email not verified", { email });
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    if (user.authProvider !== "local") {
      authLogger.warn("Login Failed: Social account attempt", { 
        email, 
        provider: user.authProvider 
      });
      return res.status(400).json({
        success: false,
        message: `This account is linked with ${user.authProvider}. Please use ${user.authProvider} login.`,
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      authLogger.warn("Login Failed: Password incorrect", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = user.generateAuthToken();

    // Prepare user response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpire;

    authLogger.info("Login Successful", { 
      userId: userResponse._id, 
      email: userResponse.email 
    });

    res.status(200).json({
      success: true,
      message: "Welcome back!",
      token,
      user: userResponse,
    });
  } catch (error) {
    authLogger.error("Login Controller Error", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get current user
// controllers/Auth.controller.js
export const getCurrentUser = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    // req.user is already set by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
