  import { useState } from "react";

  import { useAuth } from "../../context/AuthContext";

  import {
    FiMail,
    FiBriefcase,
    FiCheckCircle,
    FiEdit3,
    FiLock,
    FiChevronRight,
    FiUser,
  } from "react-icons/fi";

  import "./Profile.css";

  import EditProfileModal from "./EditProfileModal";
  import ChangePasswordModal from "./ChangePasswordModal";

  const Profile = () => {
    const { user, checkAuth } = useAuth();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const getInitials = (name = "") => {
      if (!name) return "U";

      return name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    };

    const getRoleLabel = (role) => {
      const roles = {
        STUDENT: "Student",
        FACULTY: "Faculty",
        TECHNICIAN: "Technician",
        ADMIN: "Administrator",
      };

      return roles[role] || "User";
    };

    const getDepartmentName = () => {
      if (!user?.departmentId) {
        return "Not assigned";
      }

      // When department is populated by backend
      if (typeof user.departmentId === "object") {
        return user.departmentId.name || "Not assigned";
      }

      // When backend only returns ObjectId
      return "Assigned";
    };

    const getStats = () => {
      switch (user?.role) {
        // ================= TECHNICIAN =================
        case "TECHNICIAN":
          return [
            {
              label: "Assigned Tickets",
              value: "0",
            },
            {
              label: "In Progress",
              value: "0",
            },
            {
              label: "Resolved",
              value: "0",
              highlighted: true,
            },
          ];

        // ================= ADMIN =================
        case "ADMIN":
          return [
            {
              label: "Total Users",
              value: "0",
            },
            {
              label: "Active Technicians",
              value: "0",
            },
            {
              label: "Total Departments",
              value: "0",
              highlighted: true,
            },
          ];

        // ================= STUDENT / FACULTY =================
        case "FACULTY":
        case "STUDENT":
        default:
          return [
            {
              label: "Total Reports",
              value: "0",
            },
            {
              label: "Open Reports",
              value: "0",
            },
            {
              label: "Resolved",
              value: "0",
              highlighted: true,
            },
          ];
      }
    };

    const handleProfileUpdated = async () => {
      await checkAuth();

      setIsEditModalOpen(false);
    };

    return (
      <div className="profile-page">
        {/* ================= PAGE HEADER ================= */}

        <section className="profile-page-header">
          <div>
            <p className="profile-overline">ACCOUNT SETTINGS</p>

            <h1>Profile</h1>

            <p>Manage your account and workspace preferences.</p>
          </div>
        </section>

        {/* ================= PROFILE HERO ================= */}

        <section className="profile-hero-card">
          <div className="profile-main-info">
            <div className="profile-avatar">{getInitials(user?.name)}</div>

            <div className="profile-user-details">
              <div className="profile-name-row">
                <h2>{user?.name || "User"}</h2>

                <span className="profile-role-badge">
                  {getRoleLabel(user?.role)}
                </span>
              </div>

              <div className="profile-contact">
                <FiMail />

                <span>{user?.email || "No email available"}</span>
              </div>

              <div className="profile-status">
                <FiCheckCircle />

                <span>
                  {user?.active === false ? "Account inactive" : "Account active"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FiEdit3 />
            Edit Profile
          </button>
        </section>

        {/* ================= ROLE BASED STATS ================= */}

        <section className="profile-stats-grid">
          {getStats().map((stat) => (
            <article
              key={stat.label}
              className={`profile-stat-card ${
                stat.highlighted ? "highlighted" : ""
              }`}
            >
              <p>{stat.label}</p>

              <h2>{stat.value}</h2>
            </article>
          ))}
        </section>

        {/* ================= PROFILE CONTENT ================= */}

        <section className="profile-content-grid">
          {/* ================= ACCOUNT INFORMATION ================= */}

          <article className="profile-info-card">
            <div className="profile-card-header">
              <div>
                <p className="profile-overline">PERSONAL DETAILS</p>

                <h2>Account Information</h2>
              </div>

              <FiUser className="profile-header-icon" />
            </div>

            <div className="profile-info-list">
              {/* Full Name */}

              <div className="profile-info-row">
                <span className="profile-info-label">Full name</span>

                <span className="profile-info-value">{user?.name || "—"}</span>
              </div>

              {/* Email */}

              <div className="profile-info-row">
                <span className="profile-info-label">Email address</span>

                <span className="profile-info-value">{user?.email || "—"}</span>
              </div>

              {/* Role */}

              <div className="profile-info-row">
                <span className="profile-info-label">Role</span>

                <span className="profile-info-value">
                  {getRoleLabel(user?.role)}
                </span>
              </div>

              {/* Department */}

              <div className="profile-info-row">
                <span className="profile-info-label">Department</span>

                <span className="profile-info-value">
                  <FiBriefcase />

                  {getDepartmentName()}
                </span>
              </div>

              {/* Account Status */}

              <div className="profile-info-row">
                <span className="profile-info-label">Account status</span>

                <span className="profile-info-value">
                  {user?.active === false ? "Inactive" : "Active"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="profile-secondary-button"
              onClick={() => setIsEditModalOpen(true)}
            >
              <FiEdit3 />
              Edit account information
            </button>
          </article>

          {/* ================= SECURITY ================= */}

          <article className="profile-security-card">
            <div className="profile-card-header">
              <div>
                <p className="profile-overline">SECURITY</p>

                <h2>Password & security</h2>
              </div>

              <FiLock className="profile-header-icon" />
            </div>

            <div className="security-password-row">
              <div>
                <h3>Password</h3>

                <p>Keep your account secure with a strong password.</p>
              </div>

              <span className="password-dots">••••••••</span>
            </div>

            <button
              type="button"
              className="profile-security-button"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change password
              <FiChevronRight />
            </button>
          </article>
        </section>

        {/* ================= EDIT PROFILE MODAL ================= */}

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleProfileUpdated}
        />

        {/* ================= CHANGE PASSWORD MODAL ================= */}

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    );
  };

  export default Profile;
