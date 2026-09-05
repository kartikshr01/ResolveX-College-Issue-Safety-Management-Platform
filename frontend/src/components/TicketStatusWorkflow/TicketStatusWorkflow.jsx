import { useState } from "react";

import "./TicketStatusWorkflow.css";

import { updateTicketStatus } from "../../services/ticket.service";

function TicketStatusWorkflow({ ticketId, status, setStatus }) {
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await updateTicketStatus(ticketId, newStatus);

      console.log("STATUS UPDATED:", response);

      const updatedTicket = response?.data || response;

      setStatus(updatedTicket?.status || newStatus);
    } catch (err) {
      console.error("Status update failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update ticket status",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="status-workflow">
      <h2>Update Ticket Status</h2>

      <div className="status-options">
        <button
          type="button"
          className={`status-button status-assigned ${
            status === "ASSIGNED" ? "active" : ""
          }`}
          disabled
        >
          Assigned
        </button>

        <button
          type="button"
          className={`status-button status-progress ${
            status === "IN_PROGRESS" ? "active" : ""
          }`}
          onClick={() => handleStatusChange("IN_PROGRESS")}
          disabled={updating || status !== "ASSIGNED"}
        >
          In Progress
        </button>

        <button
          type="button"
          className={`status-button status-resolved ${
            status === "RESOLVED" ? "active" : ""
          }`}
          onClick={() => handleStatusChange("RESOLVED")}
          disabled={updating || status !== "IN_PROGRESS"}
        >
          Resolved
        </button>
      </div>

      <div className="current-status">
        Current Status:
        <span>{status}</span>
      </div>

      {error && (
        <p
          style={{
            marginTop: "10px",
            color: "#c0392b",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      )}

      {updating && (
        <p
          style={{
            marginTop: "10px",
            color: "#666",
            fontSize: "13px",
          }}
        >
          Updating status...
        </p>
      )}
    </div>
  );
}

export default TicketStatusWorkflow;
