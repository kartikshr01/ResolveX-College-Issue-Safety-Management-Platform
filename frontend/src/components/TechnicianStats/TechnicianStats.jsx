import "./TechnicianStats.css";

function TechnicianStats() {
  return (
    <div className="technician-stats">

      <div className="stat-card stat-highlight">
        <div>
          <p>Assigned</p>
          <h3>1</h3>
        </div>

        <span className="stat-icon">A</span>
      </div>


      <div className="stat-card">
        <div>
          <p>In Progress</p>
          <h3>0</h3>
        </div>

        <span className="stat-icon">P</span>
      </div>


      <div className="stat-card">
        <div>
          <p>Resolved</p>
          <h3>0</h3>
        </div>

        <span className="stat-icon">R</span>
      </div>


      <div className="stat-card">
        <div>
          <p>Pending</p>
          <h3>0</h3>
        </div>

        <span className="stat-icon">P</span>
      </div>

    </div>
  );
}

export default TechnicianStats;