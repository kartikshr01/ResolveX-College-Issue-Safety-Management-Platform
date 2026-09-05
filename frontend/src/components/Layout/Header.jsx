import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
} from "../../services/notificationService";
import socket from "../../socket/socket";

import NotificationPanel from "../notification/NotificationPanel";

const Header = () => {
  const { user } = useAuth();

  const [isnotificationOpen, setIsNotificationOpen] = useState(false);
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

  useEffect(() => {
    if (!user?._id) {
      setUnreadCount(0);
      return;
    }

    let mounted = true;

    const loadUnreadCount = async () => {
      try {
        const notifications = await getMyNotifications();

        if (!mounted) return;

        setUnreadCount(
          notifications.filter(
            (notification) => !notification.read,
          ).length,
        );
      } catch (error) {
        console.error(
          "Failed to load notification count:",
          error,
        );
      }
    };

    const handleNewNotification = (notification) => {
      if (!notification) return;

      // Socket notification is already targeted to this user's room,
      // so every incoming notification increments the badge immediately.
      if (!notification.read) {
        setUnreadCount((current) => current + 1);
      }
    };

    const handleReadFromPanel = () => {
      loadUnreadCount();
    };

    loadUnreadCount();

    socket.emit("join", user._id);
    socket.on("notification", handleNewNotification);
    window.addEventListener(
      "notifications:changed",
      handleReadFromPanel,
    );

    return () => {
      mounted = false;
      socket.off("notification", handleNewNotification);
      window.removeEventListener(
        "notifications:changed",
        handleReadFromPanel,
      );
    };
  }, [user?._id]);

  const handleMarkAllFromHeader = async () => {
    if (unreadCount === 0) return;

    try {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
      window.dispatchEvent(new Event("notifications:changed"));
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-label">
          COMMUNITY SAFETY
        </span>
      </div>

      <div className="header-actions">
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="header-icon-button"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
            onClick={() =>
              setIsNotificationOpen((current) => !current)
            }
          >
            <FiBell />

            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  minWidth: 18,
                  height: 18,
                  padding: "0 5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  background: "#ef4b4b",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  lineHeight: 1,
                  boxSizing: "border-box",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              onMarkAllFromHeader={handleMarkAllFromHeader}
            />
          )}
        </div>

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

// import { FiBell } from "react-icons/fi";

// import { useAuth } from "../../context/AuthContext";

// const Header = () => {
//   const { user } = useAuth();

//   const getInitials = (name = "") => {
//     return name
//       .split(" ")
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase();
//   };

//   return (
//     <header className="app-header">
//       <div className="header-left">
//         <span className="header-label">
//           COMMUNITY SAFETY
//         </span>
//       </div>

//       <div className="header-actions">
//         <button
//           type="button"
//           className="header-icon-button"
//           aria-label="Notifications"
//         >
//           <FiBell />
//         </button>

//         <div className="header-user">
//           <div className="header-avatar">
//             {getInitials(user?.name)}
//           </div>

//           <div className="header-user-info">
//             <strong>
//               {user?.name || "ResolveX User"}
//             </strong>

//             <span>
//               {user?.role || "USER"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header; 




// import { useEffect, useState } from "react";
// import { FiBell } from "react-icons/fi";

// import { useAuth } from "../../context/AuthContext";
// import {
//   getMyNotifications,
//   markAllNotificationsAsRead,
// } from "../../services/notification.service";
// import socket from "../../socket";

// import NotificationPanel from "../notifications/NotificationPanel";

// const Header = () => {
//   const { user } = useAuth();

//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const getInitials = (name = "") => {
//     return name
//       .split(" ")
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase();
//   };

//   useEffect(() => {
//     if (!user?._id) {
//       setUnreadCount(0);
//       return;
//     }

//     let mounted = true;

//     const loadUnreadCount = async () => {
//       try {
//         const notifications = await getMyNotifications();

//         if (!mounted) return;

//         setUnreadCount(
//           notifications.filter(
//             (notification) => !notification.read,
//           ).length,
//         );
//       } catch (error) {
//         console.error(
//           "Failed to load notification count:",
//           error,
//         );
//       }
//     };

//     const handleNewNotification = (notification) => {
//       if (!notification) return;

//       // Socket notification is already targeted to this user's room,
//       // so every incoming notification increments the badge immediately.
//       if (!notification.read) {
//         setUnreadCount((current) => current + 1);
//       }
//     };

//     const handleReadFromPanel = () => {
//       loadUnreadCount();
//     };

//     loadUnreadCount();

//     socket.emit("join", user._id);
//     socket.on("notification", handleNewNotification);
//     window.addEventListener(
//       "notifications:changed",
//       handleReadFromPanel,
//     );

//     return () => {
//       mounted = false;
//       socket.off("notification", handleNewNotification);
//       window.removeEventListener(
//         "notifications:changed",
//         handleReadFromPanel,
//       );
//     };
//   }, [user?._id]);

//   const handleMarkAllFromHeader = async () => {
//     if (unreadCount === 0) return;

//     try {
//       await markAllNotificationsAsRead();
//       setUnreadCount(0);
//       window.dispatchEvent(new Event("notifications:changed"));
//     } catch (error) {
//       console.error(
//         "Failed to mark all notifications as read:",
//         error,
//       );
//     }
//   };

//   return (
//     <header className="app-header">
//       <div className="header-left">
//         <span className="header-label">
//           COMMUNITY SAFETY
//         </span>
//       </div>

//       <div className="header-actions">
//         <div
//           style={{
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <button
//             type="button"
//             className="header-icon-button"
//             aria-label="Notifications"
//             aria-expanded={isNotificationOpen}
//             onClick={() =>
//               setIsNotificationOpen((current) => !current)
//             }
//           >
//             <FiBell />

//             {unreadCount > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: -3,
//                   right: -3,
//                   minWidth: 18,
//                   height: 18,
//                   padding: "0 5px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderRadius: 999,
//                   background: "#ef4b4b",
//                   color: "#fff",
//                   fontSize: 10,
//                   fontWeight: 800,
//                   lineHeight: 1,
//                   boxSizing: "border-box",
//                 }}
//               >
//                 {unreadCount > 99 ? "99+" : unreadCount}
//               </span>
//             )}
//           </button>

//           {isNotificationOpen && (
//             <NotificationPanel
//               isOpen={isNotificationOpen}
//               onClose={() => setIsNotificationOpen(false)}
//               onMarkAllFromHeader={handleMarkAllFromHeader}
//             />
//           )}
//         </div>

//         <div className="header-user">
//           <div className="header-avatar">
//             {getInitials(user?.name)}
//           </div>

//           <div className="header-user-info">
//             <strong>
//               {user?.name || "ResolveX User"}
//             </strong>

//             <span>
//               {user?.role || "USER"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;