import { toast } from "react-hot-toast";
import { setLoading, setToken, setSignupData } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { authEndpoints } from "../apis.js";
import { customToast } from "../../utils/toast";
import { apiConnector } from "../apiConnector.js";

const { SEND_OTP_API, REGISTER_API, LOGIN_API } = authEndpoints;

// Send OTP
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SEND_OTP_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent to your email");
      navigate("/verify-email");
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Resend OTP
export function resendOtp(email) {
  return async (dispatch) => {
    const toastId = toast.loading("Resending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", `${SEND_OTP_API}/resend`, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP resent to your email");
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Register
export function signup(
  name,
  email,
  password,
  otp,
  profilePicture,
  profile,
  navigate,
) {
  return async (dispatch) => {
    const toastId = customToast.loading("Creating account...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", REGISTER_API, {
        name,
        email,
        password,
        otp,
        profilePicture,
        profile,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { token, user } = response.data;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      customToast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error);
      customToast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Login
export function login(email, password, navigate) {
  return async (dispatch) => {
    // If the token is already in Redux (not just localStorage), consider them logged in
    // But since this is the login page, we might want to allow them to re-log if needed.
    // For now, let's keep the existing check but make it clearer.
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
       // Optional: Navigate to dashboard if already authenticated
       // navigate("/dashboard");
       // return;
    }

    const toastId = customToast.loading("Verifying credentials...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Invalid credentials");
      }

      const { token, user } = response.data;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      customToast.success("Welcome back, " + (user.name.split(' ')[0]) + "!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = "Server is unreachable. If the backend was sleeping (Render cold start), it might take 30-60 seconds to wake up. Please wait a moment and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      customToast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Logout
export function logout(navigate) {
  return (dispatch) => {
    const toastId = customToast.loading("Logging out...");
    try {
      dispatch(setToken(null));
      dispatch(setUser(null));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      customToast.error(error.response?.data?.message || "Logout failed");
    } finally {
      customToast.success("Logged out successfully");
      customToast.dismiss(toastId);
    }
  };
}
