import { NavLink } from "react-router-dom";

import {
  FiLogOut,
  FiX,
} from "react-icons/fi";

import {navigationConfig,bottomNavigation  } from "./navigationConfig"
import { useAuth } from "../../context/AuthContext";

import {
  navigationConfig,
  bottomNavigation,
} from "./navigationConfig";

const Sidebar = ({
  isOpen,
  closeSidebar,
}) => {
  const { user, logout } = useAuth();

  const role = user?.role;

  const navigationItems =
    navigationConfig[role] || [];

  const getDashboardPath = () => {
    if (role === "ADMIN") {
      return "/admin";
    }

    if (role === "TECHNICIAN") {
      return "/technician";
    }

    return "/dashboard";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    }
  };

  const handleNavigationClick = () => {
    // Automatically close sidebar on mobile
    closeSidebar();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-top">

          {/* Mobile Header */}
          <div className="sidebar-mobile-header">

            {/* Logo */}
            <NavLink
              to={getDashboardPath()}
              className="sidebar-logo"
              onClick={handleNavigationClick}
            >
              <div className="sidebar-logo-mark">
                RX
              </div>

              <span>ResolveX</span>
            </NavLink>

            {/* Close Button */}
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={closeSidebar}
              aria-label="Close navigation menu"
            >
              <FiX />
            </button>

          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigationClick}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <Icon />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* Bottom Navigation */}
        <div className="sidebar-bottom">

          {bottomNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigationClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon />

                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Logout */}
          <button
            type="button"
            className="sidebar-link logout-button"
            onClick={handleLogout}
          >
            <FiLogOut />

            <span>Logout</span>
          </button>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
// import { NavLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";

// import { useAuth } from "../../context/AuthContext";

// import {
//   navigationConfig,
//   bottomNavigation,
// } from "./navigationConfig";


// const Sidebar = () => {
//   const { user, logout } = useAuth();

//   const role = user?.role;

//   const navigationItems =
//     navigationConfig[role] || [];

//   const getDashboardPath = () => {
//     if (role === "ADMIN") return "/admin";

//     if (role === "TECHNICIAN") {
//       return "/technician";
//     }

//     return "/dashboard";
//   };


//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };


//   return (
//     <aside className="sidebar">

//       <div className="sidebar-top">

//         {/* Logo */}

//         <NavLink
//           to={getDashboardPath()}
//           className="sidebar-logo"
//         >
//           <div className="sidebar-logo-mark">
//             RX
//           </div>

//           <span>ResolveX</span>
//         </NavLink>


//         {/* Role-Based Navigation */}

//         <nav className="sidebar-nav">

//           {navigationItems.map((item) => {
//             const Icon = item.icon;

//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `sidebar-link ${
//                     isActive ? "active" : ""
//                   }`
//                 }
//               >
//                 <Icon />

//                 <span>{item.label}</span>
//               </NavLink>
//             );
//           })}

//         </nav>

//       </div>


//       {/* Bottom Navigation */}

//       <div className="sidebar-bottom">

//         {bottomNavigation.map((item) => {
//           const Icon = item.icon;

//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `sidebar-link ${
//                   isActive ? "active" : ""
//                 }`
//               }
//             >
//               <Icon />

//               <span>{item.label}</span>
//             </NavLink>
//           );
//         })}


//         {/* Logout */}

//         <button
//           type="button"
//           className="sidebar-link logout-button"
//           onClick={handleLogout}
//         >
//           <FiLogOut />

//           <span>Logout</span>
//         </button>

//       </div>

//     </aside>
//   );
// };


// export default Sidebar;
