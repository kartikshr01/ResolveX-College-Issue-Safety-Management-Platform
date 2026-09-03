import { FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
// import { useEffect, useState } from "react";
// import { getMyNotifications } from "../../services/notificationService";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { user } = useAuth();

  // Get admin name from logged-in user
  const adminName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Admin";

  // Get first letter for avatar
  const avatarLetter = adminName
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="admin-navbar">

      {/* LEFT */}
      <div className="navbar-left">
        <p className="navbar-eyebrow">
          COMMUNITY SAFETY
        </p>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        {/* NOTIFICATION */}
        <button
          type="button"
          className="notification-btn"
          aria-label="Notifications"
        >
          <FiBell />

          {/* Notification count will be connected later */}
          {/* <span className="notification-badge">3</span> */}
        </button>

        {/* ADMIN PROFILE */}
        <div className="navbar-user">

          <div className="navbar-avatar">
            {avatarLetter}
          </div>

          <div className="navbar-user-info">
            <strong>{adminName}</strong>

            <span>
              {user?.role || "ADMIN"}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;