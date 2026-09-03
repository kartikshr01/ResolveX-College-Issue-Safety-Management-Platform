import { useEffect, useRef, useState } from "react";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notification.service";
import NotificationItem from "./NotificationItem";
import TicketDetailsModal from "./TicketDetailsModal";
import styles from "./NotificationPanel.module.css";

const INITIAL_VISIBLE_COUNT = 5;

function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // Ticket modal state
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyNotifications();

        setNotifications(Array.isArray(data) ? data : []);
        setShowAll(false);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  // Outside click should close notification panel
  // but NOT when clicking inside ticket modal
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [isOpen, onClose]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleRead = async (notificationId) => {
    try {
      const updatedNotification =
        await markNotificationAsRead(notificationId);

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                ...(updatedNotification || {}),
                read: true,
              }
            : notification,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err,
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (err) {
      console.error(
        "Failed to mark all notifications as read:",
        err,
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // Open ticket modal
  const handleOpenTicket = (ticketId) => {
    if (!ticketId) return;

    setSelectedTicketId(ticketId);
  };

  // Close ONLY ticket modal
  const handleCloseTicket = () => {
    setSelectedTicketId(null);
  };

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, INITIAL_VISIBLE_COUNT);

  if (!isOpen) return null;

  return (
    <div className={styles.wrapper} ref={panelRef}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h3>Notifications</h3>

            {unreadCount > 0 && (
              <span className={styles.unreadCount}>
                {unreadCount}
              </span>
            )}
          </div>

          <button
            type="button"
            className={styles.markAll}
            disabled={unreadCount === 0 || markingAll}
            onClick={handleMarkAllAsRead}
          >
            {markingAll
              ? "Marking..."
              : "Mark all as read"}
          </button>
        </div>

        <div className={styles.list}>
          {loading ? (
            <div className={styles.state}>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className={styles.state}>
              <p>{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>✓</div>

              <h4>No notifications</h4>

              <p>
                You're all caught up. New updates will
                appear here.
              </p>
            </div>
          ) : (
            visibleNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={handleRead}
                onOpenTicket={handleOpenTicket}
              />
            ))
          )}
        </div>

        {!loading &&
          !error &&
          notifications.length > INITIAL_VISIBLE_COUNT && (
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.viewAll}
                onClick={() =>
                  setShowAll((current) => !current)
                }
              >
                {showAll
                  ? "Show less"
                  : `View all notifications (${notifications.length})`}
              </button>
            </div>
          )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicketId && (
        <TicketDetailsModal
          ticketId={selectedTicketId}
          onClose={handleCloseTicket}
        />
      )}
    </div>
  );
}

export default NotificationPanel;