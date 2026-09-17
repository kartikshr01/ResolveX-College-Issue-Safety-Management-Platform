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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateMyProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      setUser(response.data);

      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">

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
          >
            <FiX />
          </button>
        </div>

        {error && (
          <div className="profile-modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

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
            />
          </div>

          <div className="profile-modal-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={onClose}
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