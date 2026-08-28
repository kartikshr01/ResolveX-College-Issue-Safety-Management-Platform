import { FiGrid, FiClipboard, FiUsers, FiBell, FiUser } from "react-icons/fi";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">R</div>

        <div>
          <h2>ResolveX</h2>
          <span>Issue Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN</p>

        <a href="#" className="nav-item active">
          <FiGrid />
          <span>Dashboard</span>
        </a>

        <a href="#" className="nav-item">
          <FiClipboard />
          <span>Tickets</span>
        </a>

        <a href="#" className="nav-item">
          <FiUsers />
          <span>Technicians</span>
        </a>

        <a href="#" className="nav-item">
          <FiBell />
          <span>Notifications</span>
        </a>

        <p className="nav-label">ACCOUNT</p>

        <a href="#" className="nav-item">
          <FiUser />
          <span>Profile</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
