import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getMyNotifications } from "../../services/notificationService";
import NotificationPanel from "../notification/NotificationPanel";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { user } = useAuth();

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getMyNotifications();

        const notifications = Array.isArray(data)
          ? data
          : [];

        const unread = notifications.filter(
          (notification) => !notification.read
        ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.error(
          "Failed to fetch unread notification count:",
          error
        );
      }
    };

    fetchUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(
      fetchUnreadCount,
      30000
    );

    return () => clearInterval(interval);
  }, []);

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
          onClick={() =>
            setShowNotifications((prev) => !prev)
          }
        >
          <FiBell />

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* NOTIFICATION PANEL */}
        {showNotifications && (
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}

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