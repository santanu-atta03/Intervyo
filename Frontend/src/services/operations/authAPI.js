import { toast } from 'react-hot-toast';
import { setLoading, setToken, setSignupData } from '../../slices/authSlice';
import { setUser } from '../../slices/profileSlice';
import { authEndpoints} from '../apis.js';
import { customToast } from '../../utils/toast';
import { apiConnector } from '../apiConnector.js';

const { SEND_OTP_API,  REGISTER_API, LOGIN_API } = authEndpoints;

// Send OTP
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading('Sending OTP...');
    dispatch(setLoading(true));

    try {
      const response = await apiConnector('POST', SEND_OTP_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success('OTP sent to your email');
      navigate('/verify-email');
    } catch (error) {
      console.error('Send OTP Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Register
export function signup(name, email, password, otp,profilePicure, profile, navigate) {
  return async (dispatch) => {
    const toastId = customToast.loading('Creating account...');
    dispatch(setLoading(true));

    try {
      const response = await apiConnector('POST',  REGISTER_API, {
        name,
        email,
        password,
        otp,
        profile,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { token, user } = response.data;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      customToast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup Error:', error);
      customToast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Login
export function login(email, password, navigate) {
  return async (dispatch) => {
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      customToast.error('You are already logged in');
      navigate('/dashboard');
      return;
    }

    const toastId = customToast.loading('Logging in...');
    dispatch(setLoading(true));

    try {
      const response = await apiConnector('POST', LOGIN_API, { email, password });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { token, user } = response.data;

      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      customToast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      customToast.error(error.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Logout
export function logout(navigate) {
  return (dispatch) => {
    const toastId = customToast.loading('Logging out...');
    try{
      dispatch(setToken(null));
      dispatch(setUser(null));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }catch(e){
      console.error('Login Error:', error);
      customToast.error(error.response?.data?.message || 'Login failed');
    }finally{
      customToast.success('Logged out successfully');
      customToast.dismiss(toastId);

    }
  };
}