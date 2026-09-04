import { FiBell } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-label">
          COMMUNITY SAFETY
        </span>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
        >
          <FiBell />
        </button>

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