import { notify } from "../../utils/sileoNotifications";
import {
  setAuthUser,
  setLoading,
  setToken,
} from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { authEndpoints } from "../apis.js";
import { apiConnector } from "../apiConnector.js";

const { SEND_OTP_API, REGISTER_API, LOGIN_API } = authEndpoints;

let authServiceWarmUp;

export function warmUpAuthService() {
  if (!authServiceWarmUp) {
    authServiceWarmUp = fetch(authEndpoints.HEALTH_CHECK_API)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Backend health check returned ${response.status}`);
        }
      })
      .catch((error) => {
        console.warn("Auth service warm-up failed:", error);
        authServiceWarmUp = null;
      });
  }

  return authServiceWarmUp;
}

// Send OTP
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = notify.loading("Sending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SEND_OTP_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      notify.success("OTP sent to your email", {
        title: "Verification Code Sent",
        description: `Check ${email} for your one-time verification code.`,
      });
      navigate("/verify-email");
    } catch (error) {
      console.error("Send OTP Error:", error);
      const message =
        error.response?.data?.message || "Failed to send OTP";
      notify.error(message, {
        title: "Couldn’t Send Verification Code",
        description: message,
      });
    } finally {
      dispatch(setLoading(false));
      notify.dismiss(toastId);
    }
  };
}

// Resend OTP
export function resendOtp(email) {
  return async (dispatch) => {
    const toastId = notify.loading("Resending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", `${SEND_OTP_API}/resend`, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      notify.success("OTP resent to your email", {
        title: "New Code Sent",
        description: `A new verification code was sent to ${email}.`,
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);
      const message =
        error.response?.data?.message || "Failed to resend OTP";
      notify.error(message, {
        title: "Couldn’t Resend Code",
        description: message,
      });
    } finally {
      dispatch(setLoading(false));
      notify.dismiss(toastId);
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
    const toastId = notify.loading("Creating account...");
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
      dispatch(setAuthUser(user));
      dispatch(setUser(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      notify.success("Registration successful!", {
        title: "Account Created",
        description: "Your account is ready. Taking you to your dashboard.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error);
      const message =
        error.response?.data?.message || "Registration failed";
      notify.error(message, {
        title: "Registration Failed",
        description: message,
      });
    } finally {
      dispatch(setLoading(false));
      notify.dismiss(toastId);
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

    const toastId = notify.loading("Verifying credentials...");
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
      dispatch(setAuthUser(user));
      dispatch(setUser(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const firstName = user.name.split(" ")[0];
      notify.success(`Welcome back, ${firstName}!`, {
        title: "Welcome Back",
        description: `You’re signed in as ${firstName}. Your interview prep is ready.`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        errorMessage =
          "Server is unreachable. If the backend was sleeping (Render cold start), it might take 30-60 seconds to wake up. Please wait a moment and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      notify.error(errorMessage, {
        title: "Sign-in Failed",
        description: errorMessage,
      });
    } finally {
      dispatch(setLoading(false));
      notify.dismiss(toastId);
    }
  };
}

// Logout
export function logout(navigate) {
  return (dispatch) => {
    const toastId = notify.loading("Logging out...");
    try {
      dispatch(setToken(null));
      dispatch(setAuthUser(null));
      dispatch(setUser(null));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      notify.success("Logged out successfully", {
        title: "Signed Out",
        description: "You have been securely logged out of your account.",
      });
    } catch (error) {
      console.error("Logout Error:", error);
      const message =
        error.response?.data?.message || "Could not log out successfully.";
      notify.error(message, {
        title: "Sign-out Failed",
        description: message,
      });
    } finally {
      notify.dismiss(toastId);
    }
  };
}
