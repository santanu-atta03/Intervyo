import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import OTP from "../models/Otp.model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
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
    const { name, email, password, otp } = req.body;

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

    // Step 1: Create user first (but not saved yet)
const user = new User({
  name,
  email,
  password,
  authProvider: "local",
  isVerified: true,
});

// Step 2: Create profile and assign user
const profile = await Profile.create({
  user: user._id, // ✅ This is the key fix
  phone: null,
  gender: null,
  age: null,
  bio: null,
  location: null,
  domain: null,
  experience: null,
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
await user.save(); // ✅ Save after assigning profile


    // Generate token
    const token = user.generateAuthToken();

    // Delete used OTP
    await OTP.deleteOne({ _id: recentOTP._id });

    // Fetch complete user data with populated profile
    const completeUser = await User.findById(user._id)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .populate('profile').exec();
      // console.log("Completed user : ",completeUser)

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

// Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const user = await User.findOne({ email }).populate('profile');
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     if (user.authProvider !== "local") {
//       return res.status(400).json({
//         success: false,
//         message: `Please login with ${user.authProvider}`,
//       });
//     }

//     if (await bcrypt.compare(password, user.password)) {
//       const token = user.generateAuthToken();

//       const userResponse = await User.findById(user._id)
//         .select('-password -resetPasswordToken -resetPasswordExpire')
//         .populate('profile');

//       res.json({
//         success: true,
//         message: "Login successful",
//         token,
//         user: userResponse,
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Password incorrect",
//       });
//     }
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//       error: error.message,
//     });
//   }
// };]

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
      .select('+password') // Include password for comparison
      .populate({
        path: 'profile',
        select: '-__v'
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        success: false,
        message: `Please login with ${user.authProvider}`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }

    const token = user.generateAuthToken();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpire;

    console.log('User on login:', JSON.stringify(userResponse, null, 2));

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Get current user
// controllers/Auth.controller.js
// export const getCurrentUser = async (req, res) => {
//   try {
//     const token = req.cookies.token;

    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     const user = await User.findById(decoded.id)
//       .select("-password -resetPasswordToken -resetPasswordExpire")
//       .populate({
//         path: 'profile',
//         select: '-__v'
//       });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     console.log('Current user fetched:', JSON.stringify(user, null, 2));

//     res.json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error("Get current user error:", error);
//     res.status(401).json({
//       success: false,
//       message: "Invalid token",
//       error: error.message,
//     });
//   }
// };
export const getCurrentUser = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store'); // <-- ADD THIS
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate({ path: 'profile', select: '-__v' });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log('Current user fetched:', JSON.stringify(user, null, 2));

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(401).json({ success: false, message: "Invalid token", error: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};