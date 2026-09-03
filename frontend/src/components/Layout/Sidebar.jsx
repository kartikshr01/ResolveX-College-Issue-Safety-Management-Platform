import { NavLink } from "react-router-dom";

import { FiLogOut } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import { userNavigation, bottomNavigation } from "./navigationConfig";

const Sidebar = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sidebar">
      {/* ================= TOP SECTION ================= */}

      <div className="sidebar-top">
        {/* Logo */}

        <NavLink to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-mark">RX</div>

          <span>ResolveX</span>
        </NavLink>

        {/* Main Navigation */}

        <nav className="sidebar-nav">
          {userNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ================= BOTTOM SECTION ================= */}

      <div className="sidebar-bottom">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
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
  );
};

export default Sidebar;
