import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const redirectUser = (user) => {
    switch (user.role) {
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;

      case "TECHNICIAN":
        navigate("/technician", { replace: true });
        break;

      case "STUDENT":
      case "FACULTY":
        navigate("/profile", { replace: true });
        break;

      default:
        navigate("/profile", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      redirectUser(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
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
            <p className="brand-tag">COLLEGE ISSUE MANAGEMENT</p>

            <h1>
              Report.
              <br />
              Route.
              <br />
              <span>Resolve.</span>
            </h1>

            <p className="brand-description">
              A smarter way to report, manage, and resolve
              college issues and safety concerns.
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
        <div className="login-card">
          <div className="form-header">
            <p className="form-overline">WELCOME BACK</p>

            <h2>Sign in to ResolveX</h2>

            <p>
              Enter your details to access your workspace.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;