import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import api from "../../services/api";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await api.get("/admin/statistics");

        setStatistics(response.data?.data || response.data);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statusBreakdown = statistics?.statusBreakdown || [];
  const technicianWorkload = statistics?.technicianWorkload || [];

  const getStatusCount = (status) => {
    const item = statusBreakdown.find(
      (item) => item._id?.toLowerCase() === status.toLowerCase()
    );

    return item?.count || 0;
  };

  const totalComplaints = statusBreakdown.reduce(
    (total, item) => total + (item.count || 0),
    0
  );

  const resolved = getStatusCount("resolved");
  const open = getStatusCount("open");

  const totalTechnicians = technicianWorkload.length;

  const activeTechnicians = technicianWorkload.filter(
    (technician) =>
      technician.status?.toLowerCase() === "active"
  ).length;

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">OVERVIEW</p>

            <h1>Good morning, Admin</h1>

            <p className="dashboard-subtitle">
              Here’s what’s happening with ResolveX today.
            </p>
          </div>

          <div className="admin-profile">
            <div className="profile-avatar">A</div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            <strong>Unable to load dashboard data</strong>
            <span>Please try again later.</span>
          </div>
        )}

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">
                Total Technicians
              </span>

              <div className="stat-icon purple">♙</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : totalTechnicians}
            </strong>

            <span className="stat-note">
              Registered technicians
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">
                Active Technicians
              </span>

              <div className="stat-icon lime">✓</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : activeTechnicians}
            </strong>

            <span className="stat-note">
              Currently active
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">
                Open Complaints
              </span>

              <div className="stat-icon purple">!</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : open}
            </strong>

            <span className="stat-note">
              Awaiting resolution
            </span>
          </div>

          <div className="stat-card dark-card">
            <div className="stat-card-top">
              <span className="stat-label">
                Resolved
              </span>

              <div className="stat-icon lime">✓</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : resolved}
            </strong>

            <span className="stat-note">
              Complaints resolved
            </span>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">ACTIVITY</p>
                <h2>Recent Activity</h2>
              </div>

              <button
                type="button"
                className="panel-action"
                onClick={() =>
                  navigate("/admin/statistics")
                }
              >
                View all
              </button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">◌</div>

              <h3>No recent activity</h3>

              <p>
                Activity from the system will appear here.
              </p>
            </div>
          </div>

          <div className="dashboard-panel quick-panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">ACTIONS</p>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="quick-actions">
              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/admin/technicians")
                }
              >
                <span className="quick-action-icon purple">
                  +
                </span>

                <span>
                  <strong>Add Technician</strong>
                  <small>
                    Create a new technician account
                  </small>
                </span>

                <span className="arrow">→</span>
              </button>

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/admin/statistics")
                }
              >
                <span className="quick-action-icon lime">
                  ↗
                </span>

                <span>
                  <strong>View Statistics</strong>
                  <small>
                    Check system performance
                  </small>
                </span>

                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;