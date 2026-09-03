import "./TicketDetailModal.css";
import api from "../../api/axios";

function TicketDetailsModal({
  ticket,
  status,
  setStatus,
  onClose,
}) {
  if (!ticket) return null;

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await api.patch(
        `/tickets/${ticket._id}/status`,
        {
          status: newStatus,
        }
      );

      console.log(
        "Status updated successfully:",
        response.data
      );

      // Update dashboard + modal
      setStatus(newStatus);

    } catch (error) {
      console.error(
        "Status update error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to update ticket status"
      );
    }
  };

  // =========================
  // DISPLAY STATUS
  // =========================

  const getStatusLabel = () => {
    if (status === "ASSIGNED") {
      return "Assigned";
    }

    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "RESOLVED") {
      return "Resolved";
    }

    return status;
  };

  return (
    <div
      className="ticket-modal-overlay"
      onClick={onClose}
    >

      <div
        className="ticket-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="ticket-modal-header">

          <div>

            <p>
              TICKET #{ticket.id}
            </p>

            <h2>
              {ticket.title}
            </h2>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* =========================
            IMAGE
        ========================= */}

        {ticket.image && (

          <div className="modal-image">

            <img
              src={ticket.image}
              alt={ticket.title}
            />

          </div>

        )}


        {/* =========================
            TAGS
        ========================= */}

        <div className="modal-tags">

          <span className="modal-category">
            {ticket.category}
          </span>

          <span className="modal-severity">
            {ticket.priority}
          </span>

          <span className="modal-status">
            {getStatusLabel()}
          </span>

        </div>


        {/* =========================
            INFORMATION
        ========================= */}

        <div className="modal-info">

          <div>

            <span>
              Location
            </span>

            <strong>
              {ticket.location}
            </strong>

          </div>


          <div>

            <span>
              Reported On
            </span>

            <strong>
              {ticket.reportedOn}
            </strong>

          </div>

        </div>


        {/* =========================
            DESCRIPTION
        ========================= */}

        <div className="modal-description">

          <h3>
            Description
          </h3>

          <p>
            {ticket.description}
          </p>

        </div>


        {/* =========================
            STATUS WORKFLOW
        ========================= */}

        <div className="modal-workflow">

          <h3>
            Update Status
          </h3>


          <div className="modal-status-buttons">

            {/* ASSIGNED */}

            <button
              className={
                status === "ASSIGNED"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleStatusUpdate("ASSIGNED")
              }
            >
              Assigned
            </button>


            {/* IN PROGRESS */}

            <button
              className={
                status === "IN_PROGRESS"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleStatusUpdate("IN_PROGRESS")
              }
            >
              In Progress
            </button>


            {/* RESOLVED */}

            <button
              className={
                status === "RESOLVED"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleStatusUpdate("RESOLVED")
              }
            >
              Resolved
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TicketDetailsModal;