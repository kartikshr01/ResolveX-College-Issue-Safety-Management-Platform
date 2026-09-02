import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TicketDetails.css";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tickets/my/${ticketId}`,
          {
            withCredentials: true,
          },
        );

        setTicket(response.data.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);

        setError(
          error.response?.data?.message || "Failed to fetch ticket details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="ticket-details-container">
        <p className="loading-message">Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-details-container">
        <button className="back-btn" onClick={() => navigate("/tickets/my-tickets")}>
          ← Back to My Tickets
        </button>

        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-container">
        <p className="error-message">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="ticket-details-container">
      {/* Back Button */}

      <button className="back-btn" onClick={() => navigate("/my-tickets")}>
        ← Back to My Tickets
      </button>

      {/* Ticket Header */}

      <div className="ticket-details-header">
        <div>
          <p className="ticket-id">Ticket ID: {ticket._id}</p>

          <h1>{ticket.title}</h1>

          <div className="header-badges">
            <span
              className={`status-badge ${ticket.status
                .toLowerCase()
                .replace("_", "-")}`}
            >
              {ticket.status.replace("_", " ")}
            </span>

            <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
              {ticket.priority}
            </span>

            {ticket.safetyFlag && (
              <span className="safety-badge">⚠ Safety Issue</span>
            )}
          </div>
          {ticket.status === "OPEN" && (
            <button
              className="edit-ticket-btn"
              onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
            >
              ✏️ Edit Ticket
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}

      <div className="ticket-details-content">
        {/* Left Section */}

        <div className="ticket-main-section">
          {/* Description */}

          <div className="details-card">
            <h2>Description</h2>

            <p className="full-description">{ticket.description}</p>
          </div>

          {/* Image */}

          {ticket.imageUrl && (
            <div className="details-card">
              <h2>Issue Image</h2>

              <img
                src={ticket.imageUrl}
                alt={ticket.title}
                className="ticket-image"
              />
            </div>
          )}
        </div>

        {/* Right Section */}

        <div className="ticket-sidebar">
          <div className="details-card">
            <h2>Ticket Information</h2>

            <div className="details-list">
              <div className="detail-row">
                <span>Department</span>

                <strong>{ticket.departmentId?.name || "Not assigned"}</strong>
              </div>

              <div className="detail-row">
                <span>Category</span>

                <strong>{ticket.category}</strong>
              </div>

              <div className="detail-row">
                <span>Location</span>

                <strong>{ticket.location}</strong>
              </div>

              <div className="detail-row">
                <span>Priority</span>

                <strong>{ticket.priority}</strong>
              </div>

              <div className="detail-row">
                <span>Status</span>

                <strong>{ticket.status.replace("_", " ")}</strong>
              </div>

              <div className="detail-row">
                <span>Safety Flag</span>

                <strong>{ticket.safetyFlag ? "Yes ⚠" : "No"}</strong>
              </div>
            </div>
          </div>

          {/* Technician */}

          <div className="details-card">
            <h2>Assigned Technician</h2>

            {ticket.technicianId ? (
              <div className="technician-info">
                <p>
                  <strong>{ticket.technicianId.name}</strong>
                </p>

                {ticket.technicianId.email && (
                  <p>{ticket.technicianId.email}</p>
                )}

                {ticket.technicianId.phone && (
                  <p>{ticket.technicianId.phone}</p>
                )}
              </div>
            ) : (
              <p className="not-assigned">No technician assigned yet.</p>
            )}
          </div>

          {/* Dates */}

          <div className="details-card">
            <h2>Timeline</h2>

            <div className="details-list">
              <div className="detail-row">
                <span>Created</span>

                <strong>
                  {new Date(ticket.createdAt).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="detail-row">
                <span>Last Updated</span>

                <strong>
                  {new Date(ticket.updatedAt).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
