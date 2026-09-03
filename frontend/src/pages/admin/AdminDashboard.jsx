import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // ========================================
    // STATISTICS API
    // ========================================

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

    // ========================================
    // ADMIN ACTIVITY API
    // ========================================

    const fetchActivities = async () => {
      try {
        setActivityLoading(true);

        const response = await api.get("/activity/admin");

        const data = response.data?.data || response.data;

        setActivities(
          Array.isArray(data)
            ? data.filter((activity) => activity.ticketId)
            : [],
        );
      } catch (err) {
        console.error("Activity API error:", err);
        setActivities([]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchDashboardData();
    fetchActivities();
  }, []);

  // ========================================
  // STATISTICS DATA
  // ========================================

  const statusBreakdown = statistics?.statusBreakdown || [];
  const technicianWorkload = statistics?.technicianWorkload || [];

  // ========================================
  // STATUS HELPER
  // ========================================

  const getStatusCount = (status) => {
    const item = statusBreakdown.find(
      (item) => item._id?.toUpperCase() === status.toUpperCase(),
    );

    return item?.count || 0;
  };

  // ========================================
  // TECHNICIAN STATISTICS
  // ========================================

  const totalTechnicians = technicianWorkload.length;

  const activeTechnicians = technicianWorkload.filter(
    (technician) => technician.status?.toLowerCase() === "active",
  ).length;

  // ========================================
  // COMPLAINT STATISTICS
  // ========================================

  const openComplaints =
    getStatusCount("OPEN") +
    getStatusCount("ASSIGNED") +
    getStatusCount("IN_PROGRESS");

  const resolvedComplaints =
    getStatusCount("RESOLVED") + getStatusCount("CLOSED");

  // ========================================
  // ACTIVITY CLICK
  // ========================================

  const handleActivityClick = (ticket) => {
    if (!ticket?._id) return;

    navigate(`/admin/activity/ticket/${ticket._id}`, {
      state: {
        ticket,
        from: "/admin",
      },
    });
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="admin-dashboard">
      {/* ======================================
          DASHBOARD BODY
      ====================================== */}

      <div className="dashboard-body">
        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="dashboard-error">
            <strong>Unable to load dashboard data</strong>
            <span>Please try again later.</span>
          </div>
        )}

        {/* ==================================
            STATISTICS CARDS
        ================================== */}

        <section className="dashboard-stats">
          {/* TOTAL TECHNICIANS */}

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">Total Technicians</span>

              <div className="stat-icon purple">♙</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : totalTechnicians}
            </strong>

            <span className="stat-note">Registered technicians</span>
          </div>

          {/* ACTIVE TECHNICIANS */}

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">Active Technicians</span>

              <div className="stat-icon lime">✓</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : activeTechnicians}
            </strong>

            <span className="stat-note">Currently active</span>
          </div>

          {/* OPEN COMPLAINTS */}

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">Open Complaints</span>

              <div className="stat-icon purple">!</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : openComplaints}
            </strong>

            <span className="stat-note">
              Open, assigned or in progress
            </span>
          </div>

          {/* RESOLVED */}

          <div className="stat-card dark-card">
            <div className="stat-card-top">
              <span className="stat-label">Resolved</span>

              <div className="stat-icon lime">✓</div>
            </div>

            <strong className="stat-value">
              {loading ? "--" : resolvedComplaints}
            </strong>

            <span className="stat-note">
              Resolved or closed complaints
            </span>
          </div>
        </section>

        {/* ==================================
            MAIN DASHBOARD GRID
        ================================== */}

        <section className="dashboard-grid">
          {/* =================================
              RECENT ACTIVITY
          ================================= */}

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">ACTIVITY</p>

                <h2>Recent Activity</h2>
              </div>

              {/* VIEW ALL */}

              <button
                type="button"
                className="panel-action"
                onClick={() => navigate("/admin/activity")}
              >
                View all
              </button>
            </div>

            {/* ACTIVITY LOADING */}

            {activityLoading ? (
              <div className="empty-state">
                <div className="empty-icon">◌</div>

                <h3>Loading activity...</h3>

                <p>Fetching recent system activity.</p>
              </div>
            ) : activities.length === 0 ? (
              /* NO ACTIVITY */

              <div className="empty-state">
                <div className="empty-icon">◌</div>

                <h3>No recent activity</h3>

                <p>No recent system activity found.</p>
              </div>
            ) : (
              /* ACTIVITY LIST */

              <div className="activity-list">
                {activities.slice(0, 5).map((activity, index) => {
                  const ticket = activity.ticketId;

                  return (
                    <button
                      type="button"
                      className="activity-item"
                      key={activity._id || index}
                      onClick={() => handleActivityClick(ticket)}
                    >
                      {/* ACTIVITY ICON */}

                      <div className="activity-icon">✓</div>

                      {/* ACTIVITY CONTENT */}

                      <div className="activity-content">
                        <strong>
                          {activity.action
                            ? activity.action.replaceAll("_", " ")
                            : "System activity"}
                        </strong>

                        <span>
                          {activity.message ||
                            ticket?.title ||
                            "Ticket activity"}
                        </span>

                        <small>
                          {activity.createdAt
                            ? new Date(
                                activity.createdAt,
                              ).toLocaleString("en-IN")
                            : ""}
                        </small>
                      </div>

                      {/* ARROW */}

                      <div className="activity-arrow">→</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================
              QUICK ACTIONS
          ================================= */}

          <div className="dashboard-panel quick-panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">ACTIONS</p>

                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="quick-actions">
              {/* ADD TECHNICIAN */}

              <button
                type="button"
                className="quick-action"
                onClick={() => navigate("/admin/technicians")}
              >
                <span className="quick-action-icon purple">+</span>

                <span>
                  <strong>Add Technician</strong>

                  <small>Create a new technician account</small>
                </span>

                <span className="arrow">→</span>
              </button>

              {/* VIEW STATISTICS */}

              <button
                type="button"
                className="quick-action"
                onClick={() => navigate("/admin/statistics")}
              >
                <span className="quick-action-icon lime">↗</span>

                <span>
                  <strong>View Statistics</strong>

                  <small>Check system performance</small>
                </span>

                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;