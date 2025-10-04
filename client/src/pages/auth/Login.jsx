import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import UserNavbar from "../../components/user/common/UserNavbar";
import { loginUser } from "../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fields = [
    {
      name: "phoneNumber",
      type: "tel",
      placeholder: "Enter the Mobile Number",
      required: true,
      autoComplete: "tel",
    },
    {
      name: "password",
      type: isPasswordVisible ? "text" : "password",
      placeholder: "Enter the Password",
      required: true,
      autoComplete: "current-password",
      helperText: "Use the password you created during registration.",
      render: ({ value = "", setValue, inputClasses }) => (
        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-emerald-100"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter the Password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className={`${inputClasses} pr-24`}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-emerald-200/80"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      ),
    },
  ];

  const socialProviders = [
    { label: "Google", onClick: () => alert("Login with Google") },
  ];

  // Handle user login via backend API
  const handleLogin = async (formValues) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Call backend API to authenticate user
      const response = await loginUser({
        mobileNumber: formValues.phoneNumber,
        password: formValues.password,
      });

      if (response.success) {
        // Redirect to home page on successful login
        navigate("/");
      } else {
        setErrorMessage(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07150f]">
      <UserNavbar />
      {errorMessage && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {errorMessage}
        </div>
      )}
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to continue your shopping journey."
        fields={fields}
        onSubmit={handleLogin}
        socialProviders={socialProviders}
        buttonLabel={isLoading ? "Signing In..." : "Sign In"}
        isSubmitDisabled={isLoading}
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/signup"
        forgetPasswordText="Forget Password?"
      />
    </div>
  );
};

export default Login;
