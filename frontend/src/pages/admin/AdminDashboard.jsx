import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCheck,
  FiUsers,
  FiAlertCircle,
  FiBarChart2,
  FiPlus,
} from "react-icons/fi";

import api from "../../services/api";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState(null);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  const [error, setError] = useState(false);

  /* =========================================
     FETCH DASHBOARD DATA
  ========================================= */

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

  /* =========================================
     STATISTICS
  ========================================= */

  const statusBreakdown = statistics?.statusBreakdown || [];
  const technicianWorkload = statistics?.technicianWorkload || [];

  const getStatusCount = (status) => {
    const item = statusBreakdown.find(
      (item) =>
        item?._id?.toUpperCase() === status.toUpperCase(),
    );

    return item?.count || 0;
  };

  const totalTechnicians = technicianWorkload.length;

  const activeTechnicians = technicianWorkload.filter(
    (technician) =>
      technician?.status?.toLowerCase() === "active",
  ).length;

  const openComplaints =
    getStatusCount("OPEN") +
    getStatusCount("ASSIGNED") +
    getStatusCount("IN_PROGRESS");

  const resolvedComplaints =
    getStatusCount("RESOLVED") +
    getStatusCount("CLOSED");

  /* =========================================
     ACTIVITY CLICK
  ========================================= */

  const handleActivityClick = (ticket) => {
    if (!ticket?._id) {
      return;
    }

    navigate(`/admin/activity/ticket/${ticket._id}`, {
      state: {
        ticket,
        from: "/admin",
      },
    });
  };

  /* =========================================
     STAT CARDS
  ========================================= */

  const stats = [
    {
      label: "Total Technicians",
      value: totalTechnicians,
      note: "Registered technicians",
      icon: <FiUsers />,
    },
    {
      label: "Active Technicians",
      value: activeTechnicians,
      note: "Currently active",
      icon: <FiCheck />,
    },
    {
      label: "Open Complaints",
      value: openComplaints,
      note: "Open, assigned or in progress",
      icon: <FiAlertCircle />,
    },
    {
      label: "Resolved",
      value: resolvedComplaints,
      note: "Resolved or closed complaints",
      icon: <FiCheck />,
      highlighted: true,
    },
  ];

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="admin-dashboard">

      {/* =====================================
          DASHBOARD HERO
      ===================================== */}

      <section className="admin-dashboard-hero">

        <div>
          <p className="admin-dashboard-overline">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="admin-dashboard-description">
            Monitor campus issues, manage technicians,
            and keep track of system activity.
          </p>
        </div>

        <button
          type="button"
          className="admin-report-button"
          onClick={() => navigate("/admin/issues")}
        >
          <FiArrowUpRight />
          View Issues
        </button>

      </section>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-dashboard-error">
          <strong>
            Unable to load dashboard data
          </strong>

          <span>
            Please try again later.
          </span>
        </div>
      )}


      {/* =====================================
          STATISTICS
      ===================================== */}

      <section className="admin-stats-grid">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`admin-stat-card ${
              stat.highlighted
                ? "highlighted"
                : ""
            }`}
          >

            <div className="admin-stat-top">

              <p>
                {stat.label}
              </p>

              <span className="admin-stat-icon">
                {stat.icon}
              </span>

            </div>

            <h2>
              {loading ? "--" : stat.value}
            </h2>

            <span className="admin-stat-note">
              {stat.note}
            </span>

          </div>
        ))}

      </section>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <section className="admin-content-grid">


        {/* ===================================
            RECENT ACTIVITY
        =================================== */}

        <div className="admin-recent-section">

          <div className="admin-section-header">

            <div>
              <p className="admin-section-overline">
                RECENT ACTIVITY
              </p>

              <h2>
                System activity
              </h2>
            </div>

            <button
              type="button"
              className="admin-view-all"
              onClick={() =>
                navigate("/admin/activity")
              }
            >
              View all
              <FiArrowUpRight />
            </button>

          </div>


          {/* LOADING */}

          {activityLoading && (
            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                <FiBarChart2 />
              </div>

              <h3>
                Loading activity...
              </h3>

              <p>
                Fetching recent system activity.
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!activityLoading &&
            activities.length === 0 && (
              <div className="admin-empty-state">

                <div className="admin-empty-icon">
                  <FiCheck />
                </div>

                <h3>
                  No recent activity
                </h3>

                <p>
                  No recent system activity found.
                </p>

              </div>
            )}


          {/* ACTIVITY LIST */}

          {!activityLoading &&
            activities.length > 0 && (

              <div className="admin-activity-list">

                {activities
                  .slice(0, 5)
                  .map((activity, index) => {

                    const ticket =
                      activity.ticketId;

                    return (
                      <button
                        type="button"
                        className="admin-activity-card"
                        key={
                          activity._id ||
                          index
                        }
                        onClick={() =>
                          handleActivityClick(
                            ticket,
                          )
                        }
                      >

                        <div className="admin-activity-icon">
                          <FiCheck />
                        </div>


                        <div className="admin-activity-content">

                          <h3>
                            {activity.action
                              ? activity.action
                                  .replaceAll(
                                    "_",
                                    " ",
                                  )
                              : "System activity"}
                          </h3>

                          <p>
                            {activity.message ||
                              ticket?.title ||
                              "Ticket activity"}
                          </p>

                          <small>
                            {activity.createdAt
                              ? new Date(
                                  activity.createdAt,
                                ).toLocaleString(
                                  "en-IN",
                                )
                              : ""}
                          </small>

                        </div>


                        <FiArrowUpRight className="admin-activity-arrow" />

                      </button>
                    );
                  })}

              </div>
            )}

        </div>


        {/* ===================================
            QUICK ACTIONS
        =================================== */}

        <aside className="admin-quick-actions">

          <p className="admin-section-overline">
            QUICK ACTIONS
          </p>

          <h2>
            What would you like to do?
          </h2>


          {/* ADD TECHNICIAN */}

          <button
            type="button"
            className="admin-quick-action primary"
            onClick={() =>
              navigate("/admin/technicians")
            }
          >

            <div>

              <span className="admin-quick-icon">
                <FiPlus />
              </span>

              <h3>
                Add Technician
              </h3>

              <p>
                Create a new technician account.
              </p>

            </div>

            <FiArrowUpRight />

          </button>


          {/* ALL ISSUES */}

          <button
            type="button"
            className="admin-quick-action"
            onClick={() =>
              navigate("/admin/issues")
            }
          >

            <div>

              <span className="admin-quick-icon">
                <FiArrowUpRight />
              </span>

              <h3>
                View All Issues
              </h3>

              <p>
                Review and manage reported issues.
              </p>

            </div>

            <FiArrowUpRight />

          </button>


          {/* STATISTICS */}

          <button
            type="button"
            className="admin-quick-action"
            onClick={() =>
              navigate("/admin/statistics")
            }
          >

            <div>

              <span className="admin-quick-icon">
                <FiBarChart2 />
              </span>

              <h3>
                View Statistics
              </h3>

              <p>
                Check system performance.
              </p>

            </div>

            <FiArrowUpRight />

          </button>

        </aside>

      </section>

    </div>
  );
};

export default AdminDashboard;