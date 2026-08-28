import {
  FiArrowLeft,
  FiEdit2,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiActivity,
} from "react-icons/fi";

import WorkloadIndicator from "../../components/Technician/WorkLoadIndicator";

function TechnicianDetails({
  technician,
  onBack,
  onEdit,
}) {
  if (!technician) {
    return (
      <div className="technician-not-found">
        <h2>Technician not found</h2>

        <button
          className="secondary-btn"
          onClick={onBack}
        >
          <FiArrowLeft />
          Back to Technicians
        </button>
      </div>
    );
  }

  return (
    <div className="technician-details-page">

      {/* HEADER */}

      <div className="details-topbar">
        <button
          className="back-btn"
          onClick={onBack}
        >
          <FiArrowLeft />
          Back to Technicians
        </button>

        <button
          className="primary-btn"
          onClick={() => onEdit(technician)}
        >
          <FiEdit2 />
          Edit Technician
        </button>
      </div>

      {/* PROFILE */}

      <div className="technician-profile-card">

        <div className="profile-main">

          <div className="profile-avatar">
            {technician.name.charAt(0)}
          </div>

          <div>
            <div className="profile-name-row">
              <h2>{technician.name}</h2>

              <span
                className={`active-status ${technician.status.toLowerCase()}`}
              >
                {technician.status}
              </span>
            </div>

            <p className="profile-id">
              {technician.id}
            </p>

            <div className="profile-availability">
              <span
                className={`availability-badge ${technician.availability.toLowerCase()}`}
              >
                <span className="status-dot" />
                {technician.availability}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="details-grid">

        {/* CONTACT */}

        <div className="details-card">

          <div className="details-card-header">
            <div className="details-icon">
              <FiMail />
            </div>

            <div>
              <h3>Contact Information</h3>
              <p>Technician contact details</p>
            </div>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>{technician.email}</strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>{technician.phone}</strong>
          </div>

        </div>

        {/* DEPARTMENT */}

        <div className="details-card">

          <div className="details-card-header">
            <div className="details-icon">
              <FiBriefcase />
            </div>

            <div>
              <h3>Department</h3>
              <p>Assigned department</p>
            </div>
          </div>

          <div className="department-detail">
            {technician.department ||
              "Not assigned"}
          </div>

        </div>

        {/* SKILLS */}

        <div className="details-card">

          <div className="details-card-header">
            <div className="details-icon">
              <FiActivity />
            </div>

            <div>
              <h3>Skills</h3>
              <p>Technician capabilities</p>
            </div>
          </div>

          <div className="details-skills">
            {technician.skills.map((skill) => (
              <span key={skill}>
                {skill}
              </span>
            ))}
          </div>

        </div>

        {/* WORKLOAD */}

        <div className="details-card">

          <div className="details-card-header">
            <div className="details-icon">
              <FiActivity />
            </div>

            <div>
              <h3>Current Workload</h3>
              <p>Assigned workload</p>
            </div>
          </div>

          <WorkloadIndicator
            currentWorkload={
              technician.currentWorkload
            }
            maxWorkload={
              technician.maxWorkload
            }
          />

          <div className="workload-detail-text">
            <strong>
              {technician.currentWorkload}
            </strong>

            <span>
              active assignments out of{" "}
              {technician.maxWorkload}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default TechnicianDetails;