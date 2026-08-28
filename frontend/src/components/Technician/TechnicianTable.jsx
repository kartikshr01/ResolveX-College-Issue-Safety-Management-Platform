import {
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import WorkloadIndicator from "./WorkLoadIndicator";

function TechnicianTable({
  technicians,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="technician-table-wrapper">
      <table className="technician-table">

        <thead>
          <tr>
            <th>Technician</th>
            <th>Contact</th>
            <th>Department</th>
            <th>Skills</th>
            <th>Availability</th>
            <th>Workload</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {technicians.map((technician) => (
            <tr key={technician.id}>

              <td>
                <div className="technician-name">

                  <div className="technician-avatar">
                    {technician.name.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {technician.name}
                    </strong>

                    <span>
                      {technician.id}
                    </span>
                  </div>

                </div>
              </td>

              <td>
                <div className="technician-contact">
                  <span>
                    {technician.email}
                  </span>

                  <span>
                    {technician.phone}
                  </span>
                </div>
              </td>

              <td>
                <span className="department-badge">
                  {technician.department ||
                    "Not assigned"}
                </span>
              </td>

              <td>
                <div className="skills-list">
                  {technician.skills.map(
                    (skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </td>

              <td>
                <span
                  className={`availability-badge ${technician.availability.toLowerCase()}`}
                >
                  <span className="status-dot" />

                  {technician.availability}
                </span>
              </td>

              <td>
                <WorkloadIndicator
                  currentWorkload={
                    technician.currentWorkload
                  }
                  maxWorkload={
                    technician.maxWorkload
                  }
                />
              </td>

              <td>
                <span
                  className={`active-status ${technician.status.toLowerCase()}`}
                >
                  {technician.status}
                </span>
              </td>

              <td>
                <div className="table-actions">

                  <button
                    className="action-btn"
                    title="View"
                    onClick={() =>
                      onView(technician)
                    }
                  >
                    <FiEye />
                  </button>

                  <button
                    className="action-btn"
                    title="Edit"
                    onClick={() =>
                      onEdit(technician)
                    }
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="action-btn delete"
                    title="Delete"
                    onClick={() =>
                      onDelete(technician)
                    }
                  >
                    <FiTrash2 />
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default TechnicianTable;