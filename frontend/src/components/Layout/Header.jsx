import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { getMyNotifications } from "../../services/notification.service";
import { useAuth } from "../../context/AuthContext";
import NotificationPanel from "../notification/NotificationPanel";

const Header = () => {
  const { user } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // FETCH UNREAD NOTIFICATION COUNT
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getMyNotifications();

        const notifications = Array.isArray(data) ? data : [];

        const unread = notifications.filter(
          (notification) => !notification.read,
        ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch unread notification count:", error);
      }
    };

    fetchUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-label">COMMUNITY SAFETY</span>
      </div>

      <div className="header-actions">
        {/* NOTIFICATION BELL */}
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
        >
          <FiBell />
        </button>

        <div className="header-user">
          <div className="header-avatar">
            {getInitials(user?.name)}
          </div>

          <div className="header-user-info">
            <strong>
              {user?.name || "ResolveX User"}
            </strong>

            <span>
              {user?.role || "USER"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
