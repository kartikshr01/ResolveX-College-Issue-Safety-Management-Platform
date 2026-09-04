import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TechnicianIssues.css";

import { getAssignedTickets } from "../../../services/ticket.service";

function TechnicianIssues() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAssignedTickets();

        const data = response?.data || response || [];

        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Assigned tickets error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load assigned tickets",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
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

  const handleViewTicket = (ticketId) => {
    if (!ticketId) {
      return;
    }

    navigate(`/technician/ticket/${ticketId}`);
  };

  if (loading) {
    return (
      <div className="technician-issues">
        <div className="issues-loading">Loading assigned issues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="technician-issues">
        <div className="issues-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="technician-issues">
      <div className="issues-header">
        <div>
          <p className="issues-eyebrow">TECHNICIAN WORK QUEUE</p>

          <h1>Assigned Issues</h1>

          <p className="issues-subtitle">
            View and manage issues currently assigned to you.
          </p>
        </div>

        <div className="issues-count">
          <strong>{tickets.length}</strong>

          <span>{tickets.length === 1 ? "Ticket" : "Tickets"}</span>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="issues-empty">
          <div className="empty-icon">✓</div>

          <h2>No Assigned Issues</h2>

          <p>You currently have no issues assigned to you.</p>
        </div>
      ) : (
        <div className="issues-list">
          {tickets.map((ticket) => {
            const ticketId = ticket._id;

            return (
              <article className="issue-card" key={ticketId}>
                <div className="issue-image">
                  {ticket.imageUrl ? (
                    <img src={ticket.imageUrl} alt={ticket.title || "Issue"} />
                  ) : (
                    <div className="issue-image-placeholder">No Image</div>
                  )}
                </div>

                <div className="issue-content">
                  <div className="issue-top">
                    <span className="issue-code">
                      #{ticket.ticketCode || ticketId}
                    </span>

                    <span
                      className={`issue-status ${getStatusClass(
                        ticket.status,
                      )}`}
                    >
                      {ticket.status || "ASSIGNED"}
                    </span>
                  </div>

                  <h2>{ticket.title || "Untitled Issue"}</h2>

                  <p className="issue-description">
                    {ticket.description || "No description available."}
                  </p>

                  <div className="issue-meta">
                    <span>{ticket.category || "General"}</span>

                    <span>{ticket.priority || "Normal"}</span>

                    <span>📍 {ticket.location || "Location unavailable"}</span>
                  </div>

                  <button
                    type="button"
                    className="view-ticket-button"
                    onClick={() => handleViewTicket(ticketId)}
                  >
                    View Ticket →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TechnicianIssues;
