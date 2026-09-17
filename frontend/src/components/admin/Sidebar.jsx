import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="admin-sidebar">
      {/* TOP SECTION */}

      <div className="sidebar-top">
        {/* BRAND */}

        <div className="sidebar-brand">
          {/* <div className="brand-logo">RX</div> */}

          <div className="brand-text">
            <h2>ResolveX</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          <p className="sidebar-section-title">MENU</p>

          {/* DASHBOARD */}

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">
              <FiGrid />
            </span>

            <span>Dashboard</span>
          </NavLink>

          {/* TECHNICIANS */}

          <NavLink
            to="/admin/technicians"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">
              <FiUsers />
            </span>

            <span>Technicians</span>
          </NavLink>

          {/*STATISTICS */}

          <NavLink
            to="/admin/statistics"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">
              <FiBarChart2 />
            </span>

            <span>Statistics</span>
          </NavLink>

          <div className="sidebar-divider"></div>
        </nav>
      </div>

      <div className="sidebar-footer">
        {/* =========================
            PROFILE
        ========================== */}

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-link-icon">
            <FiUser />
          </span>

          <span>Profile</span>
        </NavLink>

        {/* LOGOUT */}

        <button
          type="button"
          className="sidebar-logout"
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