import "./TechnicianStats.css";
function TechnicianStats() {
  return (
    <div className="technician-stats">
      <div className="stat-card">
        <h3>Assigned</h3>
        <p>0</p>
      </div>

      <div className="stat-card">
        <h3>In Progress</h3>
        <p>0</p>
      </div>

      <div className="stat-card">
        <h3>Resolved</h3>
        <p>0</p>
      </div>

      <div className="stat-card">
        <h3>Pending</h3>
        <p>0</p>
      </div>
    </div>
  );
}

export default TechnicianStats;