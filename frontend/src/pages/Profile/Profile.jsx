import { useAuth } from "../../context/AuthContext";

import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
} from "react-icons/fi";

import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatRole = (role) => {
    if (!role) return "User";

    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <div className="profile-page">
      {/* ================= HEADER ================= */}

      <div className="profile-page-header">
        <div>
          <p className="profile-overline">ACCOUNT</p>

          <h1>My Profile</h1>

          <p>
            View your account information and workspace details.
          </p>
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="profile-card">
        <div className="profile-top">
          {/* Avatar */}

          <div className="profile-avatar">
            {getInitials(user?.name)}
          </div>

          {/* User Information */}

          <div className="profile-user-details">
            <h2>{user?.name || "User"}</h2>

            <p>{user?.email}</p>

            <span
              className={`profile-role role-${user?.role?.toLowerCase()}`}
            >
              {formatRole(user?.role)}
            </span>
          </div>
        </div>

        <div className="profile-divider"></div>

        {/* ================= ACCOUNT DETAILS ================= */}

        <div className="profile-details-section">
          <h3>Account Information</h3>

          <div className="profile-details-grid">

            {/* Name */}

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <FiUser />
              </div>

              <div>
                <span className="profile-detail-label">
                  Full Name
                </span>

                <strong>
                  {user?.name || "Not available"}
                </strong>
              </div>
            </div>

            {/* Email */}

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <FiMail />
              </div>

              <div>
                <span className="profile-detail-label">
                  Email Address
                </span>

                <strong>
                  {user?.email || "Not available"}
                </strong>
              </div>
            </div>

            {/* Role */}

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <FiShield />
              </div>

              <div>
                <span className="profile-detail-label">
                  Account Role
                </span>

                <strong>
                  {formatRole(user?.role)}
                </strong>
              </div>
            </div>

            {/* Account Status */}

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <FiCalendar />
              </div>

              <div>
                <span className="profile-detail-label">
                  Account Status
                </span>

                <strong className="account-active">
                  Active
                </strong>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;