import { useState } from "react";
import {
  FiX,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { changePassword } from "../../services/user.service";

import "./ChangePasswordModal.css";


const ChangePasswordModal = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  if (!isOpen) return null;


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(
        "Password changed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="password-modal-overlay">
      <div className="password-modal">

        <div className="password-modal-header">
          <div>
            <p className="password-modal-overline">
              SECURITY
            </p>

            <h2>Change password</h2>

            <p>
              Choose a strong password to keep
              your account secure.
            </p>
          </div>

          <button
            type="button"
            className="password-modal-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>


        {error && (
          <div className="password-message password-error">
            {error}
          </div>
        )}

        {success && (
          <div className="password-message password-success">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* Current Password */}

          <div className="password-form-group">
            <label htmlFor="currentPassword">
              Current password
            </label>

            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                name="currentPassword"
                type={
                  showPasswords.current
                    ? "text"
                    : "password"
                }
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword("current")
                }
              >
                {showPasswords.current
                  ? <FiEyeOff />
                  : <FiEye />}
              </button>
            </div>
          </div>


          {/* New Password */}

          <div className="password-form-group">
            <label htmlFor="newPassword">
              New password
            </label>

            <div className="password-input-wrapper">
              <input
                id="newPassword"
                name="newPassword"
                type={
                  showPasswords.new
                    ? "text"
                    : "password"
                }
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword("new")
                }
              >
                {showPasswords.new
                  ? <FiEyeOff />
                  : <FiEye />}
              </button>
            </div>
          </div>


          {/* Confirm Password */}

          <div className="password-form-group">
            <label htmlFor="confirmPassword">
              Confirm new password
            </label>

            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showPasswords.confirm
                    ? "text"
                    : "password"
                }
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword("confirm")
                }
              >
                {showPasswords.confirm
                  ? <FiEyeOff />
                  : <FiEye />}
              </button>
            </div>
          </div>


          <div className="password-modal-actions">

            <button
              type="button"
              className="password-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="password-save-button"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update password"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};


export default ChangePasswordModal;