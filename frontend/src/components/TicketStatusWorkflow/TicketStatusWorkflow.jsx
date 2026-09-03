import { useState } from "react";

import "./TicketStatusWorkflow.css";

import { updateTicketStatus } from "../../services/ticket.service";


function TicketStatusWorkflow({
  ticketId,
  status,
  setStatus,
}) {

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");


  const handleStatusChange = async (newStatus) => {

    // Same status hai to API call mat karo
    if (newStatus === status) {
      return;
    }

    try {

      setUpdating(true);
      setError("");

      // Backend ko status bhejna
      const response = await updateTicketStatus(
        ticketId,
        newStatus
      );

      console.log(
        "Status updated successfully:",
        response
      );

      // Backend successful hone ke baad hi UI update
      setStatus(newStatus);

    } catch (error) {

      console.error(
        "Status update failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update ticket status"
      );

    } finally {

      setUpdating(false);

    }
  };


  return (
    <div className="status-workflow">

      <h2>
        Update Ticket Status
      </h2>


      <div className="status-options">

        {/* =========================
            ASSIGNED
        ========================= */}

        <button
          type="button"
          className={`status-button status-assigned ${
            status === "ASSIGNED" ||
            status === "Assigned"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleStatusChange("ASSIGNED")
          }
          disabled={updating}
        >
          Assigned
        </button>


        {/* =========================
            IN PROGRESS
        ========================= */}

        <button
          type="button"
          className={`status-button status-progress ${
            status === "IN_PROGRESS" ||
            status === "In Progress"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleStatusChange("IN_PROGRESS")
          }
          disabled={updating}
        >
          In Progress
        </button>


        {/* =========================
            RESOLVED
        ========================= */}

        <button
          type="button"
          className={`status-button status-resolved ${
            status === "RESOLVED" ||
            status === "Resolved"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleStatusChange("RESOLVED")
          }
          disabled={updating}
        >
          Resolved
        </button>

      </div>


      {/* =========================
          CURRENT STATUS
      ========================= */}

      <div className="current-status">

        Current Status:

        <span>
          {status}
        </span>

      </div>


      {/* =========================
          ERROR
      ========================= */}

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


      {/* =========================
          UPDATING
      ========================= */}

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