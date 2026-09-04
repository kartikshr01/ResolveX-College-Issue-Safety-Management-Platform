import "./TechnicianStats.css";

function TechnicianStats({ tickets = [] }) {
  const assignedCount = tickets.filter(
    (ticket) => ticket.status === "ASSIGNED"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const pendingCount = tickets.filter(
    (ticket) => ticket.status === "PENDING"
  ).length;

  return (
    <section className="technician-stats">

      {/* ASSIGNED */}

      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-title">Assigned</p>

          <h3 className="stat-number">
            {assignedCount}
          </h3>
        </div>

        <div className="stat-icon">
          A
        </div>
      </div>


      {/* IN PROGRESS */}

      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-title">In Progress</p>

          <h3 className="stat-number">
            {inProgressCount}
          </h3>
        </div>

        <div className="stat-icon">
          P
        </div>
      </div>


      {/* RESOLVED */}

      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-title">Resolved</p>

          <h3 className="stat-number">
            {resolvedCount}
          </h3>
        </div>

        <div className="stat-icon">
          R
        </div>
      </div>


      {/* PENDING */}

      <div className="stat-card">
        <div className="stat-content">
          <p className="stat-title">Pending</p>

          <h3 className="stat-number">
            {pendingCount}
          </h3>
        </div>

        <div className="stat-icon">
          P
        </div>
      </div>

    </section>
  );
}

export default TechnicianStats;