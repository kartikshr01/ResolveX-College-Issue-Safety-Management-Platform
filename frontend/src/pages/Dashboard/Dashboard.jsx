import {
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiUserCheck,
  FiActivity,
} from "react-icons/fi";

function Dashboard() {
  const stats = [
    {
      title: "Total Tickets",
      value: "128",
      icon: FiClipboard,
      label: "+12% this month",
    },
    {
      title: "Pending Tickets",
      value: "24",
      icon: FiClock,
      label: "Needs attention",
    },
    {
      title: "Resolved Tickets",
      value: "96",
      icon: FiCheckCircle,
      label: "75% resolution rate",
    },
    {
      title: "Total Technicians",
      value: "18",
      icon: FiUsers,
      label: "Across departments",
    },
    {
      title: "Available Technicians",
      value: "11",
      icon: FiUserCheck,
      label: "Ready for assignment",
    },
    {
      title: "Active Assignments",
      value: "7",
      icon: FiActivity,
      label: "Currently working",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Overview</h2>
          <p>Here's what's happening with ResolveX today.</p>
        </div>

        <span className="dashboard-date">Today</span>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon />
                </div>
              </div>

              <p>{stat.title}</p>

              <h3>{stat.value}</h3>

              <span>{stat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-tickets">
          <div className="card-heading">
            <div>
              <h3>Recent Tickets</h3>
              <p>Latest issues raised by students</p>
            </div>

            <button>View all</button>
          </div>

          <div className="ticket-list">
            <div className="ticket-row">
              <div>
                <strong>Lab Computer Not Working</strong>
                <span>IT Department</span>
              </div>

              <span className="status-badge pending">Pending</span>
            </div>

            <div className="ticket-row">
              <div>
                <strong>Classroom Fan Issue</strong>
                <span>Electrical Department</span>
              </div>

              <span className="status-badge assigned">Assigned</span>
            </div>

            <div className="ticket-row">
              <div>
                <strong>Wi-Fi Connection Problem</strong>
                <span>IT Department</span>
              </div>

              <span className="status-badge resolved">Resolved</span>
            </div>

            <div className="ticket-row">
              <div>
                <strong>Projector Not Working</strong>
                <span>Maintenance</span>
              </div>

              <span className="status-badge pending">Pending</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Technician Workload</h3>
              <p>Current workload overview</p>
            </div>
          </div>

          <div className="workload-list">
            <div className="workload-item">
              <div className="workload-info">
                <span>Rahul Sharma</span>
                <strong>3 / 5</strong>
              </div>

              <div className="progress">
                <div className="progress-fill" style={{ width: "60%" }} />
              </div>
            </div>

            <div className="workload-item">
              <div className="workload-info">
                <span>Priya Mehta</span>
                <strong>2 / 5</strong>
              </div>

              <div className="progress">
                <div className="progress-fill" style={{ width: "40%" }} />
              </div>
            </div>

            <div className="workload-item">
              <div className="workload-info">
                <span>Aman Verma</span>
                <strong>4 / 5</strong>
              </div>

              <div className="progress">
                <div className="progress-fill" style={{ width: "80%" }} />
              </div>
            </div>

            <div className="workload-item">
              <div className="workload-info">
                <span>Neha Singh</span>
                <strong>1 / 5</strong>
              </div>

              <div className="progress">
                <div className="progress-fill" style={{ width: "20%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card notifications-card">
        <div className="card-heading">
          <div>
            <h3>Recent Notifications</h3>
            <p>Latest activity in the system</p>
          </div>

          <button>View all</button>
        </div>

        <div className="notification-list">
          <div className="notification-row">
            <div className="notification-avatar">T</div>

            <div>
              <strong>New ticket assigned</strong>
              <span>Ticket #RX1024 assigned to Rahul Sharma</span>
            </div>

            <small>10 min ago</small>
          </div>

          <div className="notification-row">
            <div className="notification-avatar">✓</div>

            <div>
              <strong>Ticket resolved</strong>
              <span>Wi-Fi Connection Problem has been resolved</span>
            </div>

            <small>35 min ago</small>
          </div>

          <div className="notification-row">
            <div className="notification-avatar">!</div>

            <div>
              <strong>New issue raised</strong>
              <span>A student raised a new maintenance issue</span>
            </div>

            <small>1 hr ago</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;