import express from "express";
import {
  getProfile,
  updatePersonalInfo,
  updateProfessionalInfo,
  updateEducation,
  updateCertificates,
  updateAchievements,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../controllers/ProfileController.js";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Main profile route
router.get("/", getProfile);

// Tab-specific update routes
router.put("/personal", updatePersonalInfo);
router.put("/professional", updateProfessionalInfo);
router.put("/education", updateEducation);
router.put("/certificates", updateCertificates);
router.put("/achievements", updateAchievements);

// Profile picture routes
router.post(
  "/upload-picture",
  upload.single("profilePicture"),
  uploadProfilePicture,
);
router.delete("/picture", deleteProfilePicture);

export default router;
