import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import { updateMyProfile } from "../../services/user.service";
import { useAuth } from "../../context/AuthContext";

import "./EditProfileModal.css";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });

      setError("");
    }
  }, [isOpen, user]);

  // Don't render when modal is closed
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error while user edits
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    // Validation
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateMyProfile({
        name,
        email,
      });

      /*
        Depending on your user.service.js:

        If updateMyProfile returns:
        return response.data;

        Then response.data is the actual user data
        when backend structure is:
        {
          success: true,
          data: { ...user }
        }
      */

      const updatedUser = response.data;

      if (!updatedUser) {
        throw new Error(
          "Invalid response received from server."
        );
      }

      // Update global AuthContext user
      setUser(updatedUser);

      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="profile-modal-overlay"
      onClick={!loading ? onClose : undefined}
    >
      <div
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="profile-modal-header">
          <div>
            <p className="profile-modal-overline">
              ACCOUNT SETTINGS
            </p>

            <h2>Edit profile</h2>
          </div>

          <button
            type="button"
            className="profile-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="profile-modal-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* NAME */}

          <div className="profile-form-group">
            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={loading}
              required
            />
          </div>

          {/* EMAIL */}

          <div className="profile-form-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          {/* ACTIONS */}

          <div className="profile-modal-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profile-save-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;