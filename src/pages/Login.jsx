import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import lsiImage from "../assets/lsi.jpeg";
import axios from "axios";
import thunderbolt from "../assets/thunderbolt.png";
import { useRole } from "../context/RoleContext";
import * as AuthService from "../services/auth";

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

  // useEffect(() => {
  //   const checkEmail = async () => {
  //     try {
  //       const res = await axios.get(
  //         `https://spacestation.tunewave.in/api/Auth/check-email?email=admin@tunewave.com`,
  //         {
  //           headers: {
  //             "Access-Control-Allow-Origin": "*",
  //           },
  //         }
  //       );
  //       console.log(res.data, "Hey am using useeffect");
  //     } catch (error) {
  //       console.error("Error checking email:", error);
  //     }
  //   };
  //   checkEmail();
  // }, []);

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
    
    try {
      const data = await AuthService.checkEmail(email);
      console.log("Email check response:", data);

      if (data.exists) {
        setEmailVerified(true);
        setSuccessMessage(`Please enter your password.`);
        setDisplayName(data.displayName || data.display_name || "noUserName");
        
        // Store role if available in email check response
        // This ensures role is available immediately for Navbar rendering
        if (data.role) {
          console.log("🔐 Setting role from email check:", data.role);
          localStorage.setItem("role", data.role);
          // Dispatch custom event to notify RoleContext of role change
          window.dispatchEvent(new Event("roleChanged"));
          // Small delay to ensure RoleContext updates
          setTimeout(() => {
            console.log("🔐 Role after email check:", localStorage.getItem("role"));
          }, 100);
        }
      } else {
        setError("Email does not exist. Please check your email.");
      }
    } catch (error) {
      console.error("Email check error:", error);
      if (error.response) {
        setError(error.response.data?.message || "Failed to verify email. Please try again.");
      } else {
        setError("Network error. Try again.");
      }
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
  //       "http://spacestation.tunewave.in/api/Auth/login",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email: email, password }),
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
const handleLogin = async (e) => {
  e.preventDefault();

  if (!emailVerified) {
    return setError("Please verify your email first.");
  }

  setLoading(true);
  setError("");

  const payload = { email, password };
  console.log("🔐 Login Payload:", payload);

  try {
    const data = await AuthService.login(payload);
    console.log("Login Response:", data);

    // Use data.token instead of data.data?.token
    if (data.token) {
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("displayName", data.fullName || data.user?.fullName || payload.email);
      
      // Extract artistId and role from login response or JWT token
      let artistId = data.artistId || data.artistID || data.artist_id;
      let newRole = data.role;
      
      // If artistId not in response, try to extract from JWT token
      if (!artistId && data.token) {
        try {
          const tokenParts = data.token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("🔐 JWT payload:", payload);
            
            // Extract artistId from token
            const tokenArtistId = payload.artistId || 
                                 payload.artistID || 
                                 payload.artist_id ||
                                 payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/artistId"] ||
                                 payload.userId ||
                                 payload.userID ||
                                 payload.user_id;
            if (tokenArtistId) {
              artistId = tokenArtistId;
              console.log("🔐 Extracted artistId from JWT token:", artistId);
            }
            
            // Extract role from token if not in response
            if (!newRole) {
              const tokenRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                       payload.role || 
                       payload.Role ||
                       payload["role"];
              if (tokenRole) {
                newRole = tokenRole;
                console.log("🔐 Extracted role from JWT token:", newRole);
              }
            }
          }
        } catch (error) {
          console.warn("Failed to extract data from token:", error);
        }
      }
      
      // Store artistId if found
      if (artistId) {
        try {
          const encoded = btoa(String(artistId));
          localStorage.setItem("artistId", encoded);
        } catch (e) {
          localStorage.setItem("artistId", String(artistId));
        }
        console.log("🔐 Stored artistId:", artistId);
      }
      
      // If role not in response or token, check localStorage (from email check)
      if (!newRole) {
        const storedRole = localStorage.getItem("role");
        console.log("🔐 Checking localStorage for role:", storedRole);
        if (storedRole && storedRole !== "normal" && storedRole.trim() !== "") {
          newRole = storedRole;
          console.log("🔐 Using role from localStorage (email check):", newRole);
        }
      }
      
      // Default to "normal" if still no role found
      newRole = newRole || "normal";
      
      console.log("🔐 Final role to set:", newRole);
      localStorage.setItem("role", newRole);

      // Dispatch custom event to notify RoleContext of role change
      window.dispatchEvent(new Event("roleChanged"));
      
      // Force a small delay to ensure RoleContext updates
      setTimeout(() => {
        console.log("🔐 Role after dispatch:", localStorage.getItem("role"));
      }, 100);
        
      if (onLogin) onLogin();  // optional callback
      navigate("/dashboard");   // now navigation will work
      startAutoRefresh();
    } else {
      setError(data.message || "Login failed.");
    }
  } catch (err) {
    console.error("Login Error:", err);
    if (err.response) {
      setError(err.response.data?.message || "Login failed.");
    } else {
      setError("Network error.");
    }
  } finally {
    setLoading(false);
  }
};

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

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   // Simulate API login (you can replace with actual fetch/axios later)
  //   // const res = { user: "sid", userRole: "normal" };
  //   // const res = { user: "sid", userRole: "enterprise" };
  //   try {
  //     localStorage.setItem("jwtToken", "dummy-token");
  //     localStorage.setItem("isLoggedIn", "true");
  //     localStorage.setItem("displayName", displayName);

  //     //  Save role globally and persist
  //     const userRole = res.userRole;
  //     setRole(userRole);
  //     localStorage.setItem("role", userRole);

  //     // Continue flow
  //     onLogin();
  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     alert("Login failed");
  //   }
  // };

  // --------------------------
  // Step 2.1: SNot you
  // --------------------------

  const handleResetEmail = () => {
    setEmail("");
    setPassword("");
    setEmailVerified(false);
    setError("");
    setSuccessMessage("");
    setForgotStage("none");
  };

  // --------------------------
  // Step 3: Send OTP
  // --------------------------
  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setForgotPasswordLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Sending forgot password request for email:", email);
      
      const data = await AuthService.forgetPassword({ email });
      console.log("Forgot password response data:", data);

      // Check if successful - API returns { key, success, message, next_resend_wait_seconds }
      if (data.success && data.key) {
        setResetKey(data.key);
        setForgotStage("otp");
        setSuccessMessage(data.message || "OTP sent successfully to registered email & WhatsApp.");
        setError("");

        // Handle resend cooldown timer
        const waitSeconds = data.next_resend_wait_seconds || 60;
        if (waitSeconds > 0) {
          setResendDisabled(true);
          setResendTimer(waitSeconds);
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
        // Backend error - show detailed error message
        const errorMessage = 
          data.error || 
          data.message || 
          "Failed to send OTP. Please try again.";
        
        setError(errorMessage);
        console.error("Forgot password error response:", data);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      
      if (error.response) {
        const errorMessage = 
          error.response.data?.error || 
          error.response.data?.message || 
          `Server Error (${error.response.status})`;
        setError(errorMessage);
      } else if (error.request) {
        setError("Network error: Unable to reach the server. Please check your internet connection.");
      } else {
        setError(`Error: ${error.message || "Network error. Please check your connection and try again."}`);
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // Step 4: Validate OTP
  // --------------------------
  const handleValidateOTP = async () => {
    if (!otpCode) return setError("Enter your OTP code.");
    if (!resetKey) return setError("Reset session expired. Please start again.");
    setForgotPasswordLoading(true);
    setError("");

    try {
      const data = await AuthService.validateOtp({
        email: email,
        code: otpCode,
        key: resetKey,
      });
      console.log("OTP validation response:", data);
      
      if (data.success) {
        setResetKey(data.key || resetKey);
        setForgotStage("reset");
        setSuccessMessage(data.message || "OTP validated successfully.");
        setError("");
      } else {
        setError(data.error || data.message || "Invalid or expired OTP.");
      }
    } catch (error) {
      console.error("OTP validation error:", error);
      if (error.response) {
        setError(error.response.data?.error || error.response.data?.message || "Invalid or expired OTP.");
      } else {
        setError("Network error. Please try again.");
      }
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
    if (!resetKey) return setError("Reset session expired. Please start again.");

    setForgotPasswordLoading(true);
    setError("");

    try {
      const data = await AuthService.resetPassword({
        email: email,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        key: resetKey,
      });
      console.log("Reset password response:", data);

      if (data.success) {
        setSuccessMessage(
          data.message || "Password updated successfully and confirmation sent via Email & WhatsApp. You can now log in."
        );
        setForgotStage("none");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
        setResetKey("");
        setError("");
      } else {
        setError(data.error || data.message || "Password reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response) {
        setError(error.response.data?.error || error.response.data?.message || "Password reset failed. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // Resend OTP
  // --------------------------
  const handleResendOTP = async () => {
    if (resendDisabled) return;
    if (!resetKey) {
      setError("Reset session expired. Please start again.");
      return;
    }
    setForgotPasswordLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await AuthService.resendOtp({
        email: email,
        key: resetKey,
      });
      console.log("Resend OTP response:", data);

      if (data.success) {
        setResetKey(data.key || resetKey);
        setSuccessMessage(data.message || "OTP resent successfully to registered email & WhatsApp.");
        
        // Handle progressive resend delays
        const waitSeconds = data.next_resend_wait_seconds || 60;
        if (waitSeconds > 0) {
          setResendDisabled(true);
          setResendTimer(waitSeconds);
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
        setError(data.error || data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      if (error.response) {
        // Handle 429 rate limit response
        if (error.response.status === 429) {
          const waitSeconds = error.response.data?.remaining_seconds || 60;
          setError(error.response.data?.error || "Please wait before requesting again.");
          setResendDisabled(true);
          setResendTimer(waitSeconds);
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
        } else {
          setError(error.response.data?.error || error.response.data?.message || "Failed to resend OTP.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // --------------------------
  // JWT auto refresh / Token verification
  // --------------------------
  const startAutoRefresh = () => {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    // Verify token every 50 minutes (tokens expire after 60 minutes)
    const id = setInterval(async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        clearInterval(id);
        return;
      }
      try {
        const data = await AuthService.verifyToken(token);

        if (data.message && data.user) {
          // Token is valid, update user info if needed
          console.log("Token verified successfully");
        } else {
          // Token invalid or expired
          clearInterval(id);
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("displayName");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        // On network error, don't clear session immediately
        // Will retry on next interval
        if (error.response && error.response.status === 401) {
          // Token invalid or expired
          clearInterval(id);
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("displayName");
          localStorage.removeItem("role");
          navigate("/login");
        }
      }
    }, 50 * 60 * 1000); // Check every 50 minutes
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
          "https://img.abyssale.com/34j39c5e-31fa-4jdb-b6d4-0c97445fb9b3?text_title=Welcome&text_title.color=#FFFFFF&text_title.background_color=#FF00000&company_logo=https%3A%2F%2Fuploads-ssl.webflow.com%2F6214efb2d4b5d94158f2ff03%2F6218f45ff39a58c8dbf7eb2c_abyssale-logo.svg"
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



        <h4 className="login-title">Remove In Production</h4>
        <p className="login-subtitle">  Use as SuperAdmin email :   ven@g.com    password: ven@1234</p>

        <p className="login-subtitle">  Use as Enterprise email :   gopi@g.co      password: gopi1234</p>
        <p className="login-subtitle">  Use as Label email :   shuva@g.co      password: shiva1234</p>
        <p className="login-subtitle">  Use as Artist email :   deepu@g.com      password: deepu1234</p>

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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // prevent form from auto-submitting
                      handleVerifyEmail();
                    }
                  }}
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
                  className={`login-forgot-password ${forgotPasswordLoading ? "disabled" : ""}`}
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
                  className={`login-forgot-password ${resendDisabled ? "disabled" : ""}`}
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
              <div className="password-note">
                Note: Your password must meet the following criteria:
                <ul className="password-note-list">
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
