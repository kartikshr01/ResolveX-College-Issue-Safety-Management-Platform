import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import "./Statistics.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch("/admin/statistics");

      if (!response.ok) {
        throw new Error("Statistics request failed");
      }

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid statistics response");
      }

      const data = await response.json();

      setStatistics(data);
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

  const totalComplaints = statistics?.totalComplaints ?? 0;
  const resolved = statistics?.resolvedComplaints ?? 0;
  const pending = statistics?.pendingComplaints ?? 0;
  const open = statistics?.openComplaints ?? 0;

  const resolutionRate =
    statistics?.resolutionRate ??
    (totalComplaints > 0
      ? (resolved / totalComplaints) * 100
      : 0);

  const complaintOverview = statistics?.complaintOverview ?? [];

  const maxComplaintCount = Math.max(
    ...complaintOverview.map((item) => item.count || 0),
    1
  );

  return (
    <div className="statistics-page">
      <Sidebar />

      <main className="statistics-content">
        {/* Header */}
        <header className="statistics-header">
          <div>
            <p className="statistics-eyebrow">ANALYTICS</p>

            <h1>Statistics</h1>

            <p className="statistics-subtitle">
              Monitor complaint activity and system performance.
            </p>
          </div>

          <select className="statistics-period" defaultValue="30">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </header>

        {/* API Error */}
        {error && (
          <div className="statistics-error">
            <strong>Unable to load statistics</strong>
            <span>Please try again later.</span>

            <button type="button" onClick={fetchStatistics}>
              Retry
            </button>
          </div>
        )}

        {/* Summary */}
        <section className="statistics-summary">
          <div className="summary-card">
            <div className="summary-top">
              <span>Total Complaints</span>
              <div className="summary-icon purple">≡</div>
            </div>

            <strong>
              {loading ? "--" : totalComplaints}
            </strong>

            <small>All complaints</small>
          </div>

          <div className="summary-card">
            <div className="summary-top">
              <span>Resolved</span>
              <div className="summary-icon lime">✓</div>
            </div>

            <strong>
              {loading ? "--" : resolved}
            </strong>

            <small>Successfully resolved</small>
          </div>

          <div className="summary-card">
            <div className="summary-top">
              <span>Pending</span>
              <div className="summary-icon purple">◷</div>
            </div>

            <strong>
              {loading ? "--" : pending}
            </strong>

            <small>Awaiting resolution</small>
          </div>

          <div className="summary-card dark-summary">
            <div className="summary-top">
              <span>Resolution Rate</span>
              <div className="summary-icon lime">%</div>
            </div>

            <strong>
              {loading ? "--" : `${resolutionRate.toFixed(1)}%`}
            </strong>

            <small>Overall resolution rate</small>
          </div>
        </section>

        {/* Charts */}
        <section className="statistics-grid">
          {/* Complaint Overview */}
          <div className="statistics-card complaint-chart-card">
            <div className="statistics-card-header">
              <div>
                <p>COMPLAINTS</p>
                <h2>Complaint Overview</h2>
              </div>

              <span className="chart-badge">Activity</span>
            </div>

            <div className="chart-placeholder">
              <div className="chart-y-axis">
                <span>{maxComplaintCount}</span>
                <span>{Math.round(maxComplaintCount * 0.75)}</span>
                <span>{Math.round(maxComplaintCount * 0.5)}</span>
                <span>{Math.round(maxComplaintCount * 0.25)}</span>
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
                    <span style={{ height: "3%" }} />
                  ) : complaintOverview.length > 0 ? (
                    complaintOverview.map((item, index) => (
                      <span
                        key={`${item.day}-${index}`}
                        style={{
                          height: `${Math.max(
                            ((item.count || 0) / maxComplaintCount) * 100,
                            2
                          )}%`,
                        }}
                      />
                    ))
                  ) : null}
                </div>

                <div className="chart-labels">
                  {complaintOverview.map((item, index) => (
                    <span key={`${item.day}-label-${index}`}>
                      {item.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Status */}
          <div className="statistics-card status-card">
            <div className="statistics-card-header">
              <div>
                <p>STATUS</p>
                <h2>Complaint Status</h2>
              </div>
            </div>

            <div className="status-visual">
              <div
                className="status-circle"
                style={{
                  background: `conic-gradient(
                    var(--lime-primary) 0% ${
                      totalComplaints
                        ? (resolved / totalComplaints) * 100
                        : 0
                    }%,
                    var(--lavender) ${
                      totalComplaints
                        ? (resolved / totalComplaints) * 100
                        : 0
                    }% ${
                      totalComplaints
                        ? ((resolved + pending) / totalComplaints) * 100
                        : 0
                    }%,
                    var(--border-subtle) ${
                      totalComplaints
                        ? ((resolved + pending) / totalComplaints) * 100
                        : 0
                    }% 100%
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
              <h2>Technician Performance</h2>
            </div>

            <button type="button" className="view-all-btn">
              View all
            </button>
          </div>

          {loading ? (
            <div className="performance-empty">
              <div className="performance-icon">♙</div>
              <h3>Loading performance data</h3>
              <p>
                Fetching technician performance data.
              </p>
            </div>
          ) : statistics?.technicianPerformance?.length > 0 ? (
            <div className="performance-list">
              {statistics.technicianPerformance.map((technician) => (
                <div
                  className="performance-row"
                  key={technician.id}
                >
                  <div>
                    <strong>{technician.name}</strong>

                    <span>
                      {technician.resolvedComplaints} resolved
                    </span>
                  </div>

                  <strong>
                    {technician.resolutionRate}%
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="performance-empty">
              <div className="performance-icon">♙</div>

              <h3>No performance data</h3>

              <p>
                Technician performance data will appear here once
                complaints are processed.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Statistics;