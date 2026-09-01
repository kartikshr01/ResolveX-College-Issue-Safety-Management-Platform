import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
FiEye,
FiEyeOff,
FiAlertCircle,
FiCheckCircle,
} from "react-icons/fi";

import { registerUser } from "../../services/auth.service";

import "./Register.css";

const Register = () => {
const navigate = useNavigate();

const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
confirmPassword: "",
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((prev) => ({
  ...prev,
  [name]: value,
}));

};

const validateForm = () => {
if (formData.name.trim().length < 2) {
return "Name must be at least 2 characters long.";
}

if (!formData.email.trim()) {
  return "Please enter your email address.";
}

if (formData.password.length < 8) {
  return "Password must be at least 8 characters long.";
}

if (formData.password !== formData.confirmPassword) {
  return "Passwords do not match.";
}

return null;

};

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setSuccess("");

const validationError = validateForm();

if (validationError) {
  setError(validationError);
  return;
}

try {
  setLoading(true);

  await registerUser({
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  });

  setSuccess(
    "Account created successfully! Redirecting to login..."
  );

  setTimeout(() => {
    navigate("/login", { replace: true });
  }, 1500);
} catch (error) {
  setError(
    error.response?.data?.message ||
      "Unable to create your account. Please try again."
  );
} finally {
  setLoading(false);
}

};

return (
<div className="auth-page">
<section className="auth-brand-panel">
<div className="brand-content">
<div className="brand-logo">
<span className="logo-mark">RX</span>
<span>ResolveX</span>
</div>

      <div className="brand-main">
        <p className="brand-tag">
          COLLEGE ISSUE MANAGEMENT
        </p>

        <h1>
          One report.
          <br />
          One route.
          <br />
          <span>Real resolution.</span>
        </h1>

        <p className="brand-description">
          Join ResolveX and help create a more organized,
          responsive, and safer campus.
        </p>
      </div>

      <div className="brand-footer">
        <span className="status-dot"></span>
        Building a safer campus
      </div>
    </div>

    <div className="lavender-orb orb-one"></div>
    <div className="lavender-orb orb-two"></div>
  </section>

  <section className="auth-form-section">
    <div className="register-card">
      <div className="form-header">
        <p className="form-overline">GET STARTED</p>

        <h2>Create your account</h2>

        <p>
          Enter your details to join ResolveX.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="auth-success">
          <FiCheckCircle />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full name</label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm password
          </label>

          <div className="password-wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Create Account"}
        </button>
      </form>

      <p className="auth-switch-text">
        Already have an account?{" "}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  </section>
</div>

);
};

export default Register;