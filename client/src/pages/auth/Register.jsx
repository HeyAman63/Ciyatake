import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar";
import AuthForm from "../../components/common/AuthForm";
import Button from "../../components/common/Button";
import { sendOtp, verifyOtp, registerUser } from "../../api/auth";

const OTP_LENGTH = 6;

const Register = () => {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpFeedback, setOtpFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Send OTP to user's mobile number via backend API
  const handleSendOtp = useCallback(async (phoneNumber, resetOtp) => {
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      setOtpFeedback({
        type: "error",
        message: "Enter a valid 10-digit mobile number before requesting an OTP.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API to send OTP via Twilio
      const response = await sendOtp({ mobileNumber: phoneNumber });
      
      if (response.success) {
        setIsOtpSent(true);
        setIsOtpVerified(false);
        resetOtp?.();
        setOtpFeedback({
          type: "success",
          message: "OTP sent successfully to your mobile number!",
        });
      } else {
        setOtpFeedback({
          type: "error",
          message: response.message || "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      setOtpFeedback({
        type: "error",
        message: error.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify OTP entered by user via backend API
  const handleVerifyOtp = useCallback(
    async (enteredOtp, phoneNumber) => {
      if (!isOtpSent) {
        setOtpFeedback({
          type: "error",
          message: "Request an OTP before attempting verification.",
        });
        return;
      }

      if (!enteredOtp || enteredOtp.length !== OTP_LENGTH) {
        setOtpFeedback({
          type: "error",
          message: "Enter the 6-digit OTP that was sent to your mobile number.",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Call backend API to verify OTP via Twilio
        const response = await verifyOtp({ mobileNumber: phoneNumber, otp: enteredOtp });
        
        if (response.success) {
          setIsOtpVerified(true);
          setOtpFeedback({
            type: "success",
            message: "OTP verified successfully. You can now create your password.",
          });
        } else {
          setIsOtpVerified(false);
          setOtpFeedback({
            type: "error",
            message: response.message || "Invalid OTP. Please try again.",
          });
        }
      } catch (error) {
        setIsOtpVerified(false);
        setOtpFeedback({
          type: "error",
          message: error.message || "OTP verification failed. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isOtpSent]
  );

  const fields = [
    {
      name: "phoneNumber",
      render: ({
        value = "",
        setValue,
        formData,
        setFieldValue,
        inputClasses,
      }) => {
        const phoneId = "register-phone-input";
        const otpId = "register-otp-input";

        const handlePhoneChange = (event) => {
          const nextValue = event.target.value
            .replace(/[^0-9]/g, "")
            .slice(0, 10);
          setValue(nextValue);
        };

        const handleOtpChange = (event) => {
          const nextValue = event.target.value
            .replace(/[^0-9]/g, "")
            .slice(0, OTP_LENGTH);
          setFieldValue("otp", nextValue);
          setOtpFeedback(null);
        };

        return (
          <div className="space-y-2">
            <label
              htmlFor={phoneId}
              className="block text-sm font-medium text-emerald-100"
            >
              Mobile number & OTP
            </label>
            <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
              <div className="space-y-2">
                <input
                  id={phoneId}
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  className={inputClasses}
                  placeholder="Enter the mobile number"
                  value={value}
                  onChange={handlePhoneChange}
                  required
                />
                <Button
                  type="button"
                  className="w-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                  onClick={() =>
                    handleSendOtp(value, () => setFieldValue("otp", ""))
                  }
                  disabled={value.length !== 10 || isLoading}
                >
                  {isLoading ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
                </Button>
              </div>
              <div className="space-y-2">
                <input
                  id={otpId}
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className={`${inputClasses} disabled:opacity-60`}
                  placeholder="Enter OTP"
                  value={formData.otp ?? ""}
                  onChange={handleOtpChange}
                  disabled={!isOtpSent}
                  maxLength={OTP_LENGTH}
                />
                <Button
                  type="button"
                  className="w-full border border-emerald-300/60 bg-transparent text-emerald-100 hover:bg-emerald-400/10"
                  onClick={() => handleVerifyOtp(formData.otp ?? "", value)}
                  disabled={
                    !isOtpSent || (formData.otp ?? "").length !== OTP_LENGTH || isLoading
                  }
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </div>
            {otpFeedback ? (
              <p
                className={`text-sm ${
                  otpFeedback.type === "error"
                    ? "text-red-400"
                    : otpFeedback.type === "success"
                    ? "text-emerald-300"
                    : "text-emerald-200/80"
                }`}
              >
                {otpFeedback.message}
              </p>
            ) : null}
          </div>
        );
      },
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter the Password",
      required: true,
      disabled: !isOtpVerified,
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      required: true,
      disabled: !isOtpVerified,
      autoComplete: "new-password",
    },
    {
      name: "otp",
      hidden: true,
      defaultValue: "",
    },
  ];

  const socialProviders = [
    { label: "Google", onClick: () => alert("Register with Google") },
  ];

  // Submit registration form and create user account via backend API
  const handleSubmit = async (formValues) => {
    if (!isOtpVerified) {
      setOtpFeedback({
        type: "error",
        message: "Please verify the OTP before creating your account.",
      });
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      setOtpFeedback({
        type: "error",
        message: "Passwords do not match. Please re-enter them.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API to register user
      const response = await registerUser({
        mobileNumber: formValues.phoneNumber,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        fullName: formValues.fullName || "",
        email: formValues.email || "",
      });

      if (response.success) {
        setOtpFeedback({
          type: "success",
          message: "Account created successfully! Redirecting to home...",
        });
        setTimeout(() => navigate("/"), 1000);
      } else {
        setOtpFeedback({
          type: "error",
          message: response.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      setOtpFeedback({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07150f]">
      <UserNavbar />
      <AuthForm
        title="Create New Account"
        subtitle="Start your personalised shopping experience"
        fields={fields}
        onSubmit={handleSubmit}
        socialProviders={socialProviders}
        buttonLabel="Register"
        isSubmitDisabled={!isOtpVerified}
        footerText="Already have an account?"
        footerLinkText="Login"
        footerLinkHref="/login"
      />
    </div>
  );
};

export default Register;
