import { Link } from "react-router-dom";
import {
  FiPlus,
  FiArrowUpRight,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

import "./UserDashboard.css";


const UserDashboard = () => {
  const stats = [
    {
      label: "Total Reports",
      value: "12",
    },
    {
      label: "Open Issues",
      value: "4",
    },
    {
      label: "In Progress",
      value: "3",
    },
    {
      label: "Resolved",
      value: "5",
      highlighted: true,
    },
  ];


  const recentReports = [
    {
      id: 1,
      title: "Broken classroom projector",
      category: "General Maintenance",
      severity: "Medium",
      location: "Block B · Room 204",
      status: "In Progress",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Exposed electrical wiring",
      category: "Electrical",
      severity: "High",
      location: "Science Block · Floor 2",
      status: "Assigned",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Water leakage in corridor",
      category: "Plumbing",
      severity: "Medium",
      location: "Main Building · Floor 1",
      status: "Resolved",
      time: "2 days ago",
    },
  ];


  return (
    <div className="user-dashboard">

      {/* Header */}

      <section className="dashboard-hero">

        <div>
          <p className="dashboard-overline">
            COMMUNITY SAFETY
          </p>

          <h1>
            Your campus, made safer.
          </h1>

          <p className="dashboard-description">
            Report issues, track their progress,
            and help build a safer campus.
          </p>
        </div>


        <Link
          to="/report-issue"
          className="report-issue-button"
        >
          <FiPlus />
          Report an Issue
        </Link>

      </section>


      {/* Statistics */}

      <section className="stats-grid">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`dashboard-stat-card ${
              stat.highlighted
                ? "highlighted"
                : ""
            }`}
          >
            <p>{stat.label}</p>

            <h2>{stat.value}</h2>

          </div>
        ))}

      </section>


      {/* Main Content */}

      <section className="dashboard-content-grid">


        {/* Recent Reports */}

        <div className="recent-reports-section">

          <div className="section-header">

            <div>
              <p className="section-overline">
                RECENT ACTIVITY
              </p>

              <h2>Recent reports</h2>
            </div>


            <Link
              to="/issues"
              className="view-all-link"
            >
              View all
              <FiArrowUpRight />
            </Link>

          </div>


          <div className="reports-list">

            {recentReports.map((report) => (

              <article
                key={report.id}
                className="report-card"
              >

                <div className="report-card-main">

                  <div className="report-title-row">

                    <h3>
                      {report.title}
                    </h3>


                    <span
                      className={`status-chip ${report.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {report.status}
                    </span>

                  </div>


                  <div className="report-tags">

                    <span className="category-tag">
                      {report.category}
                    </span>

                    <span
                      className={`severity-tag ${report.severity.toLowerCase()}`}
                    >
                      {report.severity}
                    </span>

                  </div>


                  <div className="report-meta">

                    <span>
                      <FiMapPin />
                      {report.location}
                    </span>

                    <span>
                      <FiClock />
                      {report.time}
                    </span>

                  </div>

                </div>


                <FiArrowUpRight className="report-arrow" />

              </article>

            ))}

          </div>

        </div>


        {/* Quick Actions */}

        <aside className="quick-actions">

          <p className="section-overline">
            QUICK ACTIONS
          </p>

          <h2>
            What would you like to do?
          </h2>


          <Link
            to="/report-issue"
            className="quick-action-card primary-action"
          >

            <div>
              <span className="quick-action-icon">
                <FiPlus />
              </span>

              <h3>
                Report an issue
              </h3>

              <p>
                Tell us what needs attention.
              </p>
            </div>

            <FiArrowUpRight />

          </Link>


          <Link
            to="/issues"
            className="quick-action-card"
          >

            <div>
              <span className="quick-action-icon">
                <FiArrowUpRight />
              </span>

              <h3>
                Track reports
              </h3>

              <p>
                Check updates on your issues.
              </p>
            </div>

            <FiArrowUpRight />

          </Link>

        </aside>

      </section>

    </div>
  );
};


export default UserDashboard;