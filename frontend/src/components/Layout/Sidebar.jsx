import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiShield,
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === "ADMIN") return "/admin";

    if (user?.role === "TECHNICIAN") {
      return "/technician";
    }

    return "/profile";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <NavLink
          to={getDashboardPath()}
          className="sidebar-logo"
        >
          <div className="sidebar-logo-mark">RX</div>

          <span>ResolveX</span>
        </NavLink>

        <nav className="sidebar-nav">
          <NavLink
            to={getDashboardPath()}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/issues"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiFileText />
            <span>Issues</span>
          </NavLink>

          <NavLink
            to="/safety"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiShield />
            <span>Safety</span>
          </NavLink>

          <NavLink
            to="/activity"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiClock />
            <span>Activity</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <FiUser />
          <span>Profile</span>
        </NavLink>

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
  );
};

export default Sidebar;