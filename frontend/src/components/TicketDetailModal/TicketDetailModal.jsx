import "./TicketDetailModal.css";

function TicketDetailModal({
  ticket,
  status,
  setStatus,
  onClose,
  onTicketUpdated,
}) {
  if (!ticket) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tickets/${ticket._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      // Update modal status
      setStatus(newStatus);

      // Update dashboard ticket
      if (onTicketUpdated) {
        onTicketUpdated({
          ...ticket,
          status: newStatus,
        });
      }

      console.log("Status updated successfully:", data);
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    }
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
        {/* HEADER */}
        <div className="ticket-modal-header">
          <div>
            <p>
              TICKET #{ticket._id}
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

        {/* IMAGE */}
        {ticket.imageUrl && (
          <div className="modal-image">
            <img
              src={ticket.imageUrl}
              alt={ticket.title}
            />
          </div>
        )}

        {/* TAGS */}
        <div className="modal-tags">
          <span className="modal-category">
            {ticket.category}
          </span>

          <span className="modal-severity">
            {ticket.priority}
          </span>

          <span className="modal-status">
            {status}
          </span>
        </div>

        {/* INFO */}
        <div className="modal-info">
          <div>
            <span>Location</span>

            <strong>
              {ticket.location}
            </strong>
          </div>

          <div>
            <span>Reported On</span>

            <strong>
              {new Date(
                ticket.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="modal-description">
          <h3>
            Description
          </h3>

          <p>
            {ticket.description}
          </p>
        </div>

        {/* WORKFLOW */}
        <div className="modal-workflow">
          <h3>
            Update Status
          </h3>

          <div className="modal-status-buttons">

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

export default TicketDetailModal;