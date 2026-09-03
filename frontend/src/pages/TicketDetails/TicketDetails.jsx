import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./TicketDetails.css";

import TicketStatusWorkflow from "../../components/TicketStatusWorkflow/TicketStatusWorkflow";

import {
  getTechnicianTicketById,
} from "../../services/ticket.service";

function TicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("ASSIGNED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH TECHNICIAN TICKET
  // =====================================================

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTechnicianTicketById(ticketId);

        console.log("TECHNICIAN TICKET RESPONSE:", response);

        /*
          apiResponse structure:

          {
            success: true,
            message: "...",
            data: {...}
          }
        */

        const data = response?.data || response;

        if (!data) {
          throw new Error("Ticket not found");
        }

        setTicket(data);
        setStatus(data.status || "ASSIGNED");
      } catch (err) {
        console.error("Technician ticket details error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load ticket",
        );
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusUpdated = (newStatus) => {
    setStatus(newStatus);

    setTicket((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        status: newStatus,
      };
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-loading">
          <div className="loading-spinner"></div>

          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-error">
          <div className="error-icon">!</div>

          <h2>Unable to Load Ticket</h2>

          <p>{error}</p>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/technician/issues")}
          >
            ← Back to Issues
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!ticket) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-error">
          <div className="error-icon">!</div>

          <h2>Ticket Not Found</h2>

          <p>
            The ticket may have been deleted or is no longer
            assigned to you.
          </p>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/technician/issues")}
          >
            ← Back to Issues
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // HELPERS
  // =====================================================

  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case "ASSIGNED":
        return "status-assigned";

      case "IN_PROGRESS":
        return "status-progress";

      case "RESOLVED":
        return "status-resolved";

      case "PENDING":
        return "status-pending";

      default:
        return "";
    }
  };

  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="ticket-details-page">

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        className="ticket-back-button"
        onClick={() => navigate("/technician/issues")}
      >
        ← Back to Issues
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ticket-details-header">

        <div className="ticket-header-left">

          <p className="ticket-eyebrow">
            TECHNICIAN TICKET
          </p>

          <p className="ticket-id">
            #{ticket.ticketCode || ticket._id}
          </p>

          <h1>
            {ticket.title || "Untitled Ticket"}
          </h1>

          <p className="ticket-header-subtitle">
            Review the issue details and update its
            current status.
          </p>

        </div>

        <div className="ticket-header-right">

          <span
            className={`ticket-details-status ${getStatusClass(
              status
            )}`}
          >
            {status === "IN_PROGRESS"
              ? "IN PROGRESS"
              : status}
          </span>

        </div>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="ticket-details-grid">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="ticket-main-column">

          {/* IMAGE */}

          <section className="ticket-image-card">

            {ticket.imageUrl ? (
              <img
                src={ticket.imageUrl}
                alt={ticket.title || "Ticket"}
                className="ticket-details-image"
              />
            ) : (
              <div className="ticket-image-placeholder">
                <span>NO IMAGE</span>
                <p>
                  No image was attached to this ticket.
                </p>
              </div>
            )}

          </section>

          {/* DESCRIPTION */}

          <section className="ticket-description-card">

            <div className="section-heading">

              <span className="section-number">
                01
              </span>

              <div>
                <p className="section-label">
                  ISSUE DETAILS
                </p>

                <h2>
                  Description
                </h2>
              </div>

            </div>

            <p className="ticket-description">
              {ticket.description ||
                "No description available."}
            </p>

          </section>

          {/* STATUS WORKFLOW */}

          <section className="ticket-workflow-card">

            <TicketStatusWorkflow
              ticketId={ticketId}
              status={status}
              setStatus={handleStatusUpdated}
            />

          </section>

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <aside className="ticket-side-column">

          {/* TICKET INFORMATION */}

          <section className="ticket-info-card">

            <div className="section-heading">

              <span className="section-number">
                02
              </span>

              <div>
                <p className="section-label">
                  INFORMATION
                </p>

                <h2>
                  Ticket Information
                </h2>
              </div>

            </div>

            <div className="ticket-info-list">

              <div className="ticket-info-row">
                <span>Priority</span>

                <strong>
                  {ticket.priority || "N/A"}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Category</span>

                <strong>
                  {ticket.category || "N/A"}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Location</span>

                <strong>
                  {ticket.location || "N/A"}
                </strong>
              </div>

              <div className="ticket-info-row">
                <span>Reported On</span>

                <strong>
                  {formattedDate}
                </strong>
              </div>

            </div>

          </section>

          {/* REPORTER */}

          <section className="ticket-reporter-card">

            <div className="section-heading">

              <span className="section-number">
                03
              </span>

              <div>
                <p className="section-label">
                  REPORTED BY
                </p>

                <h2>
                  Student
                </h2>
              </div>

            </div>

            <div className="reporter-box">

              <div className="reporter-avatar">
                {(ticket.userId?.name ||
                  ticket.name ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="reporter-details">

                <strong>
                  {ticket.userId?.name ||
                    ticket.name ||
                    "Unknown User"}
                </strong>

                <span>
                  {ticket.userId?.email ||
                    "Email unavailable"}
                </span>

              </div>

            </div>

          </section>

          {/* TECHNICIAN */}

          <section className="ticket-technician-card">

            <div className="section-heading">

              <span className="section-number">
                04
              </span>

              <div>
                <p className="section-label">
                  ASSIGNED TO
                </p>

                <h2>
                  Technician
                </h2>
              </div>

            </div>

            <div className="technician-box">

              <div className="technician-avatar">
                {(ticket.technicianId?.name ||
                  "T")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {ticket.technicianId?.name ||
                    "You"}
                </strong>

                <span>
                  {ticket.technicianId?.email ||
                    "Assigned Technician"}
                </span>

              </div>

            </div>

          </section>

        </aside>

      </div>
    </div>
  );
}

export default TicketDetails;