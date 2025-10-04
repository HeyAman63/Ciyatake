import { apiRequest, withApiFallback } from "./client";

// Helper function to create standardized response
const createMockResponse = (data = {}) => ({
  success: true,
  ...data,
});

// Send OTP to user's mobile number via Twilio
export const sendOtp = async ({ mobileNumber }) => {
  try {
    const response = await apiRequest("/auth/send-otp", {
      method: "POST",
      body: { mobileNumber },
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to send OTP");
  }
};

// Verify OTP entered by user
export const verifyOtp = async ({ mobileNumber, otp }) => {
  try {
    const response = await apiRequest("/auth/verify-otp", {
      method: "POST",
      body: { mobileNumber, otp },
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "OTP verification failed");
  }
};

// Register new user account after OTP verification
export const registerUser = async ({ mobileNumber, password, confirmPassword, fullName, email }) => {
  try {
    const response = await apiRequest("/auth/signup", {
      method: "POST",
      body: { mobileNumber, password, confirmPassword, fullName, email },
    });
    
    // Save user token and data to localStorage
    if (response.success && response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

// Login existing user with mobile number and password
export const loginUser = async ({ mobileNumber, password }) => {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: { mobileNumber, password },
    });
    
    // Save user token and data to localStorage
    if (response.success && response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

// Logout user by clearing stored authentication data
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Get currently logged-in user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Get authentication token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
