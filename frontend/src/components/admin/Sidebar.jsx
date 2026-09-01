import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">R</div>

        <div>
          <h2>ResolveX</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">MENU</p>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-link-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/technicians"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-link-icon">♙</span>
          <span>Technicians</span>
        </NavLink>

        <NavLink
          to="/admin/statistics"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-link-icon">▥</span>
          <span>Statistics</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-help">
          <div className="help-icon">?</div>

          <div>
            <strong>Need Help?</strong>
            <span>Contact support</span>
          </div>
        </div>

        <button type="button" className="sidebar-logout">
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;