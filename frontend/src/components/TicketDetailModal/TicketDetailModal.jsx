import "./TicketDetailModal.css";
import api from "../../api/axios";
function TicketDetailModal({ ticket, status, setStatus, onClose }) {
  if (!ticket) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await api.patch(`/tickets/${ticket._id}/status`, {
        status: newStatus,
      });

      setStatus(newStatus);

      console.log("Status updated:", response.data);
    } catch (error) {
      console.error(
        "Status update error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div
        className="ticket-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="ticket-modal-header">
          <div>
            <p>TICKET #{ticket.id}</p>

            <h2>{ticket.title}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Image */}
        {ticket.image && (
          <div className="modal-image">
            <img src={ticket.image} alt={ticket.title} />
          </div>
        )}

        {/* Tags */}
        <div className="modal-tags">
          <span className="modal-category">{ticket.category}</span>

          <span className="modal-severity">{ticket.priority}</span>

          <span className="modal-status">{status}</span>
        </div>

        {/* Information */}
        <div className="modal-info">
          <div>
            <span>Location</span>
            <strong>{ticket.location}</strong>
          </div>

          <div>
            <span>Reported On</span>
            <strong>{ticket.reportedOn}</strong>
          </div>
        </div>

        {/* Description */}
        <div className="modal-description">
          <h3>Description</h3>

          <p>{ticket.description}</p>
        </div>

        {/* Status */}
        <div className="modal-workflow">
          <h3>Update Status</h3>

          <div className="modal-status-buttons">
            <button
              className={status === "Assigned" ? "active" : ""}
              onClick={() => handleStatusUpdate("ASSIGNED")}
            >
              Assigned
            </button>

            <button
              className={status === "In Progress" ? "active" : ""}
              onClick={() => handleStatusUpdate("IN_PROGRESS")}
            >
              In Progress
            </button>

            <button
              className={status === "Resolved" ? "active" : ""}
              onClick={() => handleStatusUpdate("RESOLVED")}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailModal;
