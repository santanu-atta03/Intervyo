import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("profile").exec();
    // console.log("User details : ",user)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // console.log("user : ",user)
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, gender, age, bio, location } = req.body;

    // Validate
    if (name && name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long",
      });
    }

    if (age && (age < 16 || age > 100)) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 16 and 100",
      });
    }

    // Update User name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) {
      user.name = name.trim();
      await user.save();
    }

    // Find or create profile
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = await Profile.create({
        user: userId,
        phone: phone?.trim() || null,
        gender: gender || null,
        age: age ? parseInt(age) : null,
        bio: bio?.trim() || null,
        location: location?.trim() || null,
      });

      user.profile = profile._id;
      await user.save();
    } else {
      // Update Profile personal fields only
      const updateData = {};
      if (phone !== undefined) updateData.phone = phone?.trim() || null;
      if (gender !== undefined) updateData.gender = gender || null;
      if (age !== undefined) updateData.age = age ? parseInt(age) : null;
      if (bio !== undefined) updateData.bio = bio?.trim() || null;
      if (location !== undefined)
        updateData.location = location?.trim() || null;

      await Profile.findOneAndUpdate({ user: userId }, updateData, {
        new: true,
        runValidators: true,
      });
    }

    // Fetch complete user data with profile
    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update personal info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update personal information",
      error: error.message,
    });
  }
};

export const updateProfessionalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { domain, experience, skills, linkedIn, github, portfolio } =
      req.body;

    // Update Profile professional fields only
    const updateData = {};
    if (domain !== undefined) updateData.domain = domain || null;
    if (experience !== undefined)
      updateData.experience = experience ? parseInt(experience) : null;
    if (skills !== undefined) updateData.skills = skills || [];
    if (linkedIn !== undefined) updateData.linkedIn = linkedIn?.trim() || null;
    if (github !== undefined) updateData.github = github?.trim() || null;
    if (portfolio !== undefined)
      updateData.portfolio = portfolio?.trim() || null;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Professional information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update professional info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update professional information",
      error: error.message,
    });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { education } = req.body;

    if (!Array.isArray(education)) {
      return res.status(400).json({
        success: false,
        message: "Education must be an array",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { education: education },
      { new: true, runValidators: true },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update education error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update education",
      error: error.message,
    });
  }
};

export const updateCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { certificates } = req.body;

    if (!Array.isArray(certificates)) {
      return res.status(400).json({
        success: false,
        message: "Certificates must be an array",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { certificates: certificates },
      { new: true, runValidators: true },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Certificates updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update certificates",
      error: error.message,
    });
  }
};

export const updateAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { achievements } = req.body;

    if (!Array.isArray(achievements)) {
      return res.status(400).json({
        success: false,
        message: "Achievements must be an array",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { achievements: achievements },
      { new: true, runValidators: true },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Achievements updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update achievements error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update achievements",
      error: error.message,
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profilePicture) {
      await deleteFromCloudinary(user.profilePicture);
    }

    user.profilePicture = req.file.path;
    await user.save();

    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: req.file.path,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload picture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
      error: error.message,
    });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profilePicture) {
      await deleteFromCloudinary(user.profilePicture);
      user.profilePicture = null;
      await user.save();
    }

    const updatedUser = await User.findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("profile");

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Delete picture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete profile picture",
    });
  }
};
