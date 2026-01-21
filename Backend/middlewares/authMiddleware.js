// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    next();
  } catch (error) {
    console.error("❌ [AUTH MIDDLEWARE] Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};
