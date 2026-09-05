import styles from "./NotificationItem.module.css";

const notificationConfig = {
  SAFETY_ALERT: {
    title: "Safety Alert",
    variant: "alert",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.svgIcon} aria-hidden="true">
        <path
          d="M12 3.5 21 19a1.5 1.5 0 0 1-1.3 2.25H4.3A1.5 1.5 0 0 1 3 19l9-15.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 9v4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
      </svg>
    ),
  },

  TICKET_RESOLVED: {
    title: "Ticket Resolved",
    variant: "success",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.svgIcon} aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m8.2 12.2 2.5 2.5 5.1-5.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  TICKET_ASSIGNED: {
    title: "Ticket Assigned",
    variant: "assigned",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.svgIcon} aria-hidden="true">
        <circle
          cx="12"
          cy="8"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M6.5 19a5.5 5.5 0 0 1 11 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M17.5 11.5h3M19 10v3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  STATUS_CHANGED: {
    title: "Status Updated",
    variant: "lavender",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.svgIcon} aria-hidden="true">
        <path
          d="M17.5 7.5A7 7 0 1 0 19 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M17.5 4.5v3h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  TICKET_CREATED: {
    title: "New Ticket Created",
    variant: "ticket",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.svgIcon} aria-hidden="true">
        <path
          d="M5 8a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v2a2 2 0 0 1 0 4v2a2 2 0 0 0-2 2H7a2 2 0 0 0-2-2v-2a2 2 0 0 1 0-4V8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 9h6M9 12h6M9 15h3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  GENERAL: {
    title: "Notification",
    variant: "info",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.svgIcon} aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 10.5v5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
};

function getTimeAgo(date) {
  if (!date) return "";

  const now = new Date();
  const created = new Date(date);
  const difference = Math.floor((now - created) / 1000);

  if (difference < 60) return "Just now";

  const minutes = Math.floor(difference / 60);

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return created.toLocaleDateString();
}

function NotificationItem({
  notification,
  onRead,
  onOpenTicket,
}) {
  const config =
    notificationConfig[notification.type] ||
    notificationConfig.GENERAL;

  const hasTicket = Boolean(notification.ticketId);

  const handleNotificationClick = async () => {
    if (!notification.read && onRead) {
      await onRead(notification._id);
    }

    if (hasTicket && onOpenTicket) {
      onOpenTicket(notification.ticketId);
    }
  };

  const handleTicketClick = async (event) => {
    event.stopPropagation();

    if (!notification.read && onRead) {
      await onRead(notification._id);
    }

    if (onOpenTicket) {
      onOpenTicket(notification.ticketId);
    }
  };

  return (
    <article
      className={`${styles.item} ${
        !notification.read ? styles.unread : ""
      }`}
    >
      <button
        type="button"
        className={styles.mainButton}
        onClick={handleNotificationClick}
      >
        <span
          className={`${styles.icon} ${styles[config.variant]}`}
        >
          {config.icon}
        </span>

        <span className={styles.content}>
          <span className={styles.title}>
            {config.title}
          </span>

          <span className={styles.message}>
            {notification.message}
          </span>

          <span className={styles.time}>
            {getTimeAgo(notification.createdAt)}
          </span>
        </span>

        {!notification.read && (
          <span
            className={styles.unreadDot}
            aria-label="Unread notification"
          />
        )}
      </button>

      {hasTicket && (
        <button
          type="button"
          className={styles.ticketAction}
          onClick={handleTicketClick}
        >
          <span>View ticket</span>
          <span aria-hidden="true">→</span>
        </button>
      )}
    </article>
  );
}

export default NotificationItem;