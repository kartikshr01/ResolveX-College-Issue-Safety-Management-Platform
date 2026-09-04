import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TechnicianIssues.css";

import { getAssignedTickets } from "../../../services/ticket.service";

import TechnicianTicketCard from "../../../components/TechnicianTicketCard/TechnicianTicketCard";

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
    if (!ticketId) return;
    navigate(`/tickets/${ticketId}`);
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
        <div className="technician-tickets-list">
          {tickets.map((ticket) => (
            <TechnicianTicketCard
              key={ticket._id}
              ticket={ticket}
              onClick={() => handleViewTicket(ticket._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicianIssues;
