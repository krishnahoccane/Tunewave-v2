import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import lsiImage from "../assets/lsi.jpeg";
import axios from "axios";
import thunderbolt from "../assets/thunderbolt.png";
import { useRole } from "../context/RoleContext";



export default function Login({ onLogin }) {
  const navigate = useNavigate();

  // Auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password
  const [forgotStage, setForgotStage] = useState("none"); // none | otp | reset
  const [otpCode, setOtpCode] = useState("");
  const [resetKey, setResetKey] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [refreshIntervalId, setRefreshIntervalId] = useState(null);

  const [displayName, setDisplayName] = useState("");
const { setRole } = useRole(); 
  // Dynamic Image
  const [cardImage, setCardImage] = useState(lsiImage); // default fallback

  // ------------------------------------Email Validation-----------------------------
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // --------------------------
  // Step 1: Verify Email
  // --------------------------
  const handleVerifyEmail = async () => {
    if (!email) return setError("Please enter your email.");
    if (!validateEmail(email))
      return setError("Please enter a valid email address.");

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setEmailVerified(true);
    try {
      const res = await fetch(
        `https://spacestation.tunewave.in/wp-json/user-info/v2/check-user?data=${email}`
      );
      const data = await res.json();

      console.log("🛰️ Response status:", data.status);
      if (data.exists) {
        setEmailVerified(true);
        setSuccessMessage(`Please enter your password.`);
        setDisplayName(data.display_name || "User");
      } else {
        setError("Email does not exist. Please check your email.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Step 2: Login
  // --------------------------
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!emailVerified) return setError("Please verify your email first.");
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await fetch(
  //       "https://spacestation.tunewave.in/wp-json/jwt-auth/v1/token",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ username: email, password }),
  //       }
  //     );

  //     const data = await res.json();
  //     if (res.ok && data.data?.token) {
  //       localStorage.setItem("jwtToken", data.data.token);
  //       localStorage.setItem("isLoggedIn", "true");
  //       localStorage.setItem(
  //         "displayName",
  //         data.data.displayName || data.data.user_nicename || email
  //       );
  //       onLogin();
  //       navigate("/dashboard");
  //       startAutoRefresh();
  //     } else setError(data.message || "Login failed.");
  //   } catch {
  //     setError("Network error.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   localStorage.setItem("jwtToken", "dummy-token");
  //   localStorage.setItem("isLoggedIn", "true");
  //   localStorage.setItem("displayName", displayName);
  //   // Set role from user info (for integration, fetch from API)
  //   localStorage.setItem("role", "normal"); 
  //   const userRole = res.data.role; 
  //     setRole(userRole);
  //   onLogin();
  //   navigate("/dashboard");
  // };
// const res = {"user":"s", "userRole":"normal"};
//   const handleLogin = async (e) => {
//     e.preventDefault();
//    localStorage.setItem("jwtToken", "dummy-token");
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("displayName", displayName);

//       const userRole = res.data.role; // "normal" or "enterprise"
//       setRole(userRole); // set globally

//       // Save to localStorage (optional)
//       localStorage.setItem("role", userRole);
//   onLogin();
//       // Redirect
//       navigate("/dashboard");
//     // } catch (err) {
//     //   alert("Login failed");
//     // }
  // };

  //  const handleLogin = async (e) => {
  //   e.preventDefault();

  //   // Simulating login response
  //   const res = { user: "s", userRole: "normal" }; 

  //   try {
  //     localStorage.setItem("jwtToken", "dummy-token");
  //     localStorage.setItem("isLoggedIn", "true");
  //     localStorage.setItem("displayName", displayName);

  //     //  Correctly access role and set in context + localStorage
  //     const userRole = res.userRole; // "normal" or "enterprise"
  //     setRole(userRole);
  //     localStorage.setItem("role", userRole);

  //     // Proceed after login
  //     onLogin();
  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     alert("Login failed");
  //   }

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simulate API login (you can replace with actual fetch/axios later)
    // const res = { user: "sid", userRole: "normal" }; 
    const res = { user: "sid", userRole: "enterprise" }; // or "enterprise"
    try {
      localStorage.setItem("jwtToken", "dummy-token");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("displayName", displayName);

      //  Save role globally and persist
      const userRole = res.userRole;
      setRole(userRole);
      localStorage.setItem("role", userRole);

      // Continue flow
      onLogin();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  // --------------------------
  // Step 2.1: SNot you
  // --------------------------

  const handleResetEmail = () => {
    setEmail("");
    setPassword("");
    setEmailVerified(true);
    setError("");
    setSuccessMessage("");
    setForgotStage("none");
  };

  // --------------------------
  // Step 3: Send OTP
  // --------------------------
  const handleSendOTP = async () => {
    if (!emailVerified) return setError("Email not verified.");
    setForgotPasswordLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        `https://spacestation.tunewave.in/wp-json/users/v2/forgetpassword?user=${email}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.success) {
        setResetKey(data.key);
        setForgotStage("otp");
        setSuccessMessage(data.message || "OTP sent successfully.");

        if (data.attempt) {
          setResendDisabled(true);
          setResendTimer(data.attempt * 30); // Example: cooldown
          const timerInterval = setInterval(() => {
            setResendTimer((prev) => {
              if (prev <= 1) {
                clearInterval(timerInterval);
                setResendDisabled(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // Step 4: Validate OTP
  // --------------------------
  const handleValidateOTP = async () => {
    if (!otpCode) return setError("Enter your OTP code.");
    setForgotPasswordLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://spacestation.tunewave.in/wp-json/users/v2/codevalidate?user=${email}&code=${otpCode}&key=${resetKey}`,
        { method: "POST" }
      );
      const data = await res.json();
      console.log("OTP validation response:", data.otp);
      if (data.success) {
        setResetKey(data.key || resetKey);
        setForgotStage("reset");
        setSuccessMessage(data.message || "OTP validated successfully.");
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // Step 5: Set New Password
  // --------------------------

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const noSpaces = /^\S+$/;

    if (!minLength.test(password))
      return "Password must be at least 8 characters long.";
    if (!uppercase.test(password))
      return "Password must include at least one uppercase letter.";
    if (!lowercase.test(password))
      return "Password must include at least one lowercase letter.";
    if (!number.test(password))
      return "Password must include at least one number.";
    if (!specialChar.test(password))
      return "Password must include at least one special character (!@#$%^&*).";
    if (!noSpaces.test(password)) return "Password must not contain spaces.";

    return null; // valid password
  };

  const handleSetNewPassword = async () => {
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!newPassword || !confirmPassword)
      return setError("Enter both password fields.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    setForgotPasswordLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://spacestation.tunewave.in/wp-json/users/v2/password?user=${email}&newpassword=${newPassword}&confirmpassword=${confirmPassword}&key=${resetKey}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          data.message || " Password changed successfully! You can now log in."
        );
        setForgotStage("none");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
        setResetKey("");
      } else {
        setError(data.error || "Password reset failed. Please try again.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // Resend OTP
  // --------------------------
  const handleResendOTP = async () => {
    if (resendDisabled) return;
    setForgotPasswordLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        `https://spacestation.tunewave.in/wp-json/users/v2/resendcode?user=${email}&key=${resetKey}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message || "OTP resent successfully.");
        if (data.attempt) {
          setResendDisabled(true);
          setResendTimer(data.attempt * 30);
          const timerInterval = setInterval(() => {
            setResendTimer((prev) => {
              if (prev <= 1) {
                clearInterval(timerInterval);
                setResendDisabled(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        setError(data.error || "Failed to resend OTP.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // JWT auto refresh
  // --------------------------
  const startAutoRefresh = () => {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    const id = setInterval(async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;
      try {
        const res = await fetch(
          "https://spacestation.tunewave.in/wp-json/jwt-auth/v1/token/refresh",
          { method: "POST", headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && data.token) localStorage.setItem("jwtToken", data.token);
        else {
          clearInterval(id);
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        }
      } catch {}
    }, 60 * 1000);
    setRefreshIntervalId(id);
  };

  useEffect(() => {
    return () => {
      if (refreshIntervalId) clearInterval(refreshIntervalId);
    };
  }, [refreshIntervalId]);

  // --------------------------

  // Fetch dynamic image on mountuseEffect(() => {
  useEffect(() => {
    const fetchCardImage = async () => {
      try {
        const res = await axios.get(
          "https://spacestation.tunewave.in/wp-json/frontend/v2/artwork"
        );
        if (res.data.image) setCardImage(res.data.image);
      } catch (err) {
        console.error("Failed to fetch card image:", err);
      }
    };

    fetchCardImage();
  }, []);

  // UI Rendering
  // --------------------------

  return (
    <div className="connected-container">
      {/* Left Section */}
      <div className="login-left-side">
        {emailVerified ? (
          <h1 className="login-title">Welcome back, {displayName}!</h1>
        ) : (
          <>
            <h1 className="login-title">HELLO THERE</h1>
            <p className="login-subtitle">Login to Tunewave</p>
          </>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          {/* <h2>Login to Label</h2> */}
          {error && <p className="error">{error}</p>}
          {/* {successMessage && <p className="success">{successMessage}</p>} */}
          {successMessage && (
            <div className="success-message-row">
              {emailVerified ? (
                <p className="success">
                  Email verified successfully, {displayName}.{" "}
                  <span className="click-here-link" onClick={handleResetEmail}>
                    Not me?
                  </span>
                </p>
              ) : (
                <p className="success">{successMessage}</p>
              )}
            </div>
          )}

          {/* Step 1: Email verify */}
          {!emailVerified && forgotStage === "none" && (
            <>
              <label className="login-label-txt">
                Email Address
                <input
                  className="login-input-box"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="login-btn"
                onClick={handleVerifyEmail}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // prevent form from auto-submitting
                    handleVerifyEmail();
                  }
                }}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </>
          )}

          {/* Step 2: Password Login */}
          {emailVerified && forgotStage === "none" && (
            <>
              <label className="login-label-txt">
                Password
                <input
                  className="login-input-box"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div className="forget-login">
                <p
                  className="login-forgot-password"
                  style={{
                    cursor: forgotPasswordLoading ? "not-allowed" : "pointer",
                  }}
                  onClick={() => !forgotPasswordLoading && handleSendOTP()}
                >
                  Forgot Password?
                </p>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // prevent form from auto-submitting
                      handleVerifyEmail();
                    }
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </>
          )}

          {/* OTP Stage */}
          {forgotStage === "otp" && (
            <>
              <label className="login-label-txt">
                Enter OTP
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />
              </label>

              <div className="resend-validate-otp">
                <p
                  className="login-forgot-password"
                  style={{ cursor: resendDisabled ? "not-allowed" : "pointer" }}
                  onClick={handleResendOTP}
                >
                  {resendDisabled
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </p>

                <button
                  type="button"
                  className="login-btn"
                  onClick={handleValidateOTP}
                  disabled={forgotPasswordLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleValidateOTP();
                    }
                  }}
                >
                  {forgotPasswordLoading ? "Validating..." : "Validate OTP"}
                </button>
              </div>
            </>
          )}

          {/* Reset Password */}
          {forgotStage === "reset" && (
            <>
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginTop: "4px",
                  lineHeight: "1.4",
                  textAlign: "left",
                }}
              >
                Note: Your password must meet the following criteria:
                <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                  <li>Minimum length: 8 characters</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character (e.g., !@#$%^&*)</li>
                  <li>No spaces</li>
                </ul>
              </div>
              <label className="login-label-txt">
                New Password
                <input
                  className="login-input-box"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label className="login-label-txt">Confirm Password</label>
              <input
                className="login-input-box"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-btn"
                onClick={handleSetNewPassword}
                disabled={forgotPasswordLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleValidateOTP();
                  }
                }}
              >
                {forgotPasswordLoading ? "Updating..." : "Set New Password"}
              </button>
            </>
          )}
        </form>
        <p className="login-p">---------- sign-in ----------</p>
      </div>

      <div className="login-vertical-text">
        <span>SIGN IN</span>
      </div>
      {/* Right Section */}
      <div className="login-right-side">
        <div className="login-card">
          <div className="thunderbolt-ellipse">
            <img
              src={thunderbolt}
              alt="Thunderbolt"
              className="thunderbolt-image"
            />
          </div>
          <p>
            <span>Powering</span>
            <span>Independent</span>
            <span>Music</span>
          </p>

          <img
            className="login-card-image"
            src={cardImage}
            alt="Random Artwork"
          />
        </div>
      </div>
    </div>
  );
}
