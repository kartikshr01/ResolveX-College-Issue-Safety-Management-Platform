import { FiSearch, FiBell } from "react-icons/fi";

function Header() {
  return (
    <header className="header">
      <div>
        <h1>Dashboard</h1>
        <p>Manage your college issues efficiently.</p>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button className="notification-btn">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-mini">
          <div className="profile-avatar">K</div>

          <div>
            <strong>Khushi</strong>
            <span>Technician Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;