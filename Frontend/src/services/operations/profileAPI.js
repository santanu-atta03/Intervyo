// services/operations/profileAPI.js
import toast from "react-hot-toast";

import { profileEndpoints } from "../apis";
import { setUser, setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";

const {
  GET_PROFILE_API,
  UPDATE_PROFILE_API,
  UPDATE_PERSONAL_INFO_API,
  UPDATE_PROFESSIONAL_INFO_API,
  UPDATE_EDUCATION_API,
  UPDATE_CERTIFICATES_API,
  UPDATE_ACHIEVEMENTS_API,
  UPLOAD_PROFILE_PICTURE_API,
  DELETE_PROFILE_PICTURE_API,
} = profileEndpoints;

// Get user profile
export function getUserProfile(token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("User from api : ", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      return { success: true };
    } catch (error) {
      console.error("GET_PROFILE_API ERROR:", error);
      toast.error(error?.response?.data?.message || "Could not load profile");
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// Update personal information only (Profile Tab)
export function updatePersonalInfo(token, personalData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating personal information...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PERSONAL_INFO_API,
        personalData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Personal information updated successfully");
      return { success: true };
    } catch (error) {
      console.error("UPDATE_PERSONAL_INFO_API ERROR:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Could not update personal information";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

// Update professional information only (Professional Tab)
export function updateProfessionalInfo(token, professionalData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating professional information...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFESSIONAL_INFO_API,
        professionalData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Professional information updated successfully");
      return { success: true };
    } catch (error) {
      console.error("UPDATE_PROFESSIONAL_INFO_API ERROR:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Could not update professional information";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

// Update education only (Education Tab)
export function updateEducation(token, education) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating education...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_EDUCATION_API,
        { education },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Education updated successfully");
      return { success: true };
    } catch (error) {
      console.error("UPDATE_EDUCATION_API ERROR:", error);
      const errorMessage =
        error?.response?.data?.message || "Could not update education";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

// Update certificates only (Certificates Tab)
export function updateCertificates(token, certificates) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating certificates...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_CERTIFICATES_API,
        { certificates },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Certificates updated successfully");
      return { success: true };
    } catch (error) {
      console.error("UPDATE_CERTIFICATES_API ERROR:", error);
      const errorMessage =
        error?.response?.data?.message || "Could not update certificates";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

// Update achievements only (Achievements Tab)
export function updateAchievements(token, achievements) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating achievements...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_ACHIEVEMENTS_API,
        { achievements },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Achievements updated successfully");
      return { success: true };
    } catch (error) {
      console.error("UPDATE_ACHIEVEMENTS_API ERROR:", error);
      const errorMessage =
        error?.response?.data?.message || "Could not update achievements";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

// Update entire profile (for backward compatibility)
export function updateProfile(token, profileData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        profileData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("UPDATE_PROFILE_API ERROR:", error);
      const errorMessage =
        error?.response?.data?.message || "Could not update profile";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

// Upload profile picture
export function uploadProfilePicture(token, file) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading profile picture...");

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await apiConnector(
        "POST",
        UPLOAD_PROFILE_PICTURE_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Profile picture uploaded successfully");
      return { success: true, profilePicture: response.data.profilePicture };
    } catch (error) {
      console.error("UPLOAD_PROFILE_PICTURE_API ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Could not upload profile picture",
      );
      return { success: false };
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Delete profile picture
export function deleteProfilePicture(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting profile picture...");
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_PROFILE_PICTURE_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));
      toast.success("Profile picture deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("DELETE_PROFILE_PICTURE_API ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Could not delete profile picture",
      );
      return { success: false };
    } finally {
      toast.dismiss(toastId);
    }
  };
}
