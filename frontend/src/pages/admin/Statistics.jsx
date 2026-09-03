import { useEffect, useState } from "react";

import api from "../../services/api";

import "./Statistics.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/admin/statistics");

      console.log("Statistics API response:", response.data);

      setStatistics(response.data?.data || {});
    } catch (err) {
      console.error("Statistics API error:", err);
      setError(true);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  /*
   * Backend statistics data
   */

  const statusBreakdown = statistics?.statusBreakdown || [];

  const departmentBreakdown =
    statistics?.departmentBreakdown || [];

  const priorityBreakdown =
    statistics?.priorityBreakdown || [];

  const technicianWorkload =
    statistics?.technicianWorkload || [];

  /*
   * Get count of a particular ticket status
   */

  const getStatusCount = (status) => {
    return (
      statusBreakdown.find(
        (item) =>
          String(item._id).toUpperCase() ===
          status.toUpperCase()
      )?.count || 0
    );
  };

  /*
   * Total complaints
   */

  const totalComplaints = statusBreakdown.reduce(
    (total, item) =>
      total + Number(item.count || 0),
    0
  );

  /*
   * Documentation workflow:
   * ASSIGNED → IN PROGRESS → RESOLVED → CLOSED
   */

  const resolved = getStatusCount("RESOLVED");

  const pending =
    getStatusCount("ASSIGNED") +
    getStatusCount("IN PROGRESS");

  const open = getStatusCount("OPEN");

  const resolutionRate =
    totalComplaints > 0
      ? (resolved / totalComplaints) * 100
      : 0;

  /*
   * Department-wise complaint overview
   */

  const complaintOverview = departmentBreakdown;

  const maxComplaintCount = Math.max(
    ...complaintOverview.map(
      (item) => Number(item.count || 0)
    ),
    1
  );

  /*
   * Donut chart percentages
   */

  const resolvedPercentage =
    totalComplaints > 0
      ? (resolved / totalComplaints) * 100
      : 0;

  const pendingPercentage =
    totalComplaints > 0
      ? ((resolved + pending) / totalComplaints) * 100
      : 0;

  return (
    <div className="statistics-page">
      {/* ================================
          PAGE CONTENT
      ================================= */}

      <main className="statistics-content">
        {/* Page Header */}

        <header className="statistics-header">
          <div>
            <p className="statistics-eyebrow">
              ANALYTICS
            </p>

            <h1>Statistics</h1>

            <p className="statistics-subtitle">
              Monitor complaint activity and system
              performance.
            </p>
          </div>

          <select
            className="statistics-period"
            defaultValue="30"
          >
            <option value="7">
              Last 7 days
            </option>

            <option value="30">
              Last 30 days
            </option>

            <option value="90">
              Last 90 days
            </option>
          </select>
        </header>

        {/* API Error */}

        {error && (
          <div className="statistics-error">
            <strong>
              Unable to load statistics
            </strong>

            <span>
              Please try again later.
            </span>

            <button
              type="button"
              onClick={fetchStatistics}
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary Cards */}

        <section className="statistics-summary">
          {/* Total Complaints */}

          <div className="summary-card">
            <div className="summary-top">
              <span>Total Complaints</span>

              <div className="summary-icon purple">
                ≡
              </div>
            </div>

            <strong>
              {loading ? "--" : totalComplaints}
            </strong>

            <small>All complaints</small>
          </div>

          {/* Resolved */}

          <div className="summary-card">
            <div className="summary-top">
              <span>Resolved</span>

              <div className="summary-icon lime">
                ✓
              </div>
            </div>

            <strong>
              {loading ? "--" : resolved}
            </strong>

            <small>
              Successfully resolved
            </small>
          </div>

          {/* Pending */}

          <div className="summary-card">
            <div className="summary-top">
              <span>Pending</span>

              <div className="summary-icon purple">
                ◷
              </div>
            </div>

            <strong>
              {loading ? "--" : pending}
            </strong>

            <small>
              Awaiting resolution
            </small>
          </div>

          {/* Resolution Rate */}

          <div className="summary-card dark-summary">
            <div className="summary-top">
              <span>Resolution Rate</span>

              <div className="summary-icon lime">
                %
              </div>
            </div>

            <strong>
              {loading
                ? "--"
                : `${resolutionRate.toFixed(1)}%`}
            </strong>

            <small>
              Overall resolution rate
            </small>
          </div>
        </section>

        {/* Charts */}

        <section className="statistics-grid">
          {/* Department Complaint Overview */}

          <div className="statistics-card complaint-chart-card">
            <div className="statistics-card-header">
              <div>
                <p>COMPLAINTS</p>

                <h2>
                  Complaint Overview
                </h2>
              </div>

              <span className="chart-badge">
                By Department
              </span>
            </div>

            <div className="chart-placeholder">
              <div className="chart-y-axis">
                <span>
                  {maxComplaintCount}
                </span>

                <span>
                  {Math.round(
                    maxComplaintCount * 0.75
                  )}
                </span>

                <span>
                  {Math.round(
                    maxComplaintCount * 0.5
                  )}
                </span>

                <span>
                  {Math.round(
                    maxComplaintCount * 0.25
                  )}
                </span>

                <span>0</span>
              </div>

              <div className="chart-area">
                <div className="chart-grid-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="chart-line">
                  {loading ? (
                    <span
                      style={{
                        height: "3%",
                      }}
                    />
                  ) : complaintOverview.length > 0 ? (
                    complaintOverview.map(
                      (item, index) => (
                        <span
                          key={`${item.departmentName}-${index}`}
                          style={{
                            height: `${Math.max(
                              ((item.count || 0) /
                                maxComplaintCount) *
                                100,
                              2
                            )}%`,
                          }}
                        />
                      )
                    )
                  ) : (
                    <div className="chart-no-data">
                      No complaint data
                    </div>
                  )}
                </div>

                <div className="chart-labels">
                  {complaintOverview.map(
                    (item, index) => (
                      <span
                        key={`${item.departmentName}-label-${index}`}
                      >
                        {item.departmentName}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Status */}

          <div className="statistics-card status-card">
            <div className="statistics-card-header">
              <div>
                <p>STATUS</p>

                <h2>
                  Complaint Status
                </h2>
              </div>
            </div>

            <div className="status-visual">
              <div
                className="status-circle"
                style={{
                  background: `conic-gradient(
                    var(--lime-primary) 0% ${resolvedPercentage}%,
                    var(--lavender) ${resolvedPercentage}% ${pendingPercentage}%,
                    var(--border-subtle) ${pendingPercentage}% 100%
                  )`,
                }}
              >
                <div className="status-circle-inner">
                  <strong>
                    {loading ? "--" : resolved}
                  </strong>

                  <span>Resolved</span>
                </div>
              </div>
            </div>

            <div className="status-legend">
              <div>
                <span className="legend-dot resolved" />

                <span>Resolved</span>

                <strong>
                  {loading ? "--" : resolved}
                </strong>
              </div>

              <div>
                <span className="legend-dot pending" />

                <span>Pending</span>

                <strong>
                  {loading ? "--" : pending}
                </strong>
              </div>

              <div>
                <span className="legend-dot open" />

                <span>Open</span>

                <strong>
                  {loading ? "--" : open}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Technician Performance */}

        <section className="statistics-card technician-performance">
          <div className="statistics-card-header">
            <div>
              <p>PERFORMANCE</p>

              <h2>
                Technician Performance
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="performance-empty">
              <div className="performance-icon">
                ♙
              </div>

              <h3>
                Loading performance data
              </h3>

              <p>
                Fetching technician workload data.
              </p>
            </div>
          ) : technicianWorkload.length > 0 ? (
            <div className="performance-list">
              {technicianWorkload.map(
                (technician, index) => (
                  <div
                    className="performance-row"
                    key={
                      technician._id || index
                    }
                  >
                    <div>
                      <strong>
                        {technician.name ||
                          "Unknown Technician"}
                      </strong>

                      <span>
                        {technician.currentWorkload ??
                          0}{" "}
                        active complaints
                      </span>
                    </div>

                    <strong>
                      {technician.status ||
                        "active"}
                    </strong>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="performance-empty">
              <div className="performance-icon">
                ♙
              </div>

              <h3>
                No workload data
              </h3>

              <p>
                Technician workload data will appear
                here once technicians are assigned
                complaints.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Statistics;