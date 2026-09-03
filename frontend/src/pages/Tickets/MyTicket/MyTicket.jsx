import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../MyTicket/MyTicket.css";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tickets/my",
          {
            withCredentials: true,
          },
        );

        setTickets(response.data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch tickets. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) {
    return (
      <div className="my-tickets-container">
        <h2>Loading tickets...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tickets-container">
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <div className="my-tickets-container">
      <div className="my-tickets-header">
        <div>
          <h1>My Tickets</h1>
          <p>Track and manage all your submitted issues.</p>
        </div>

        <div className="ticket-count">
          {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <h2>No tickets found</h2>
          <p>You haven't created any tickets yet.</p>

          <button
            className="create-ticket-btn"
            onClick={() => navigate("/create-ticket")}
          >
            Create Ticket
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div className="ticket-card" key={ticket._id}>
              {/* Header */}
              <div className="ticket-header">
                <h3>{ticket.title}</h3>

                <span
                  className={`status-badge ${ticket.status
                    .toLowerCase()
                    .replace("_", "-")}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </div>

              {/* Description */}
              <p className="ticket-description">{ticket.description}</p>

              {/* Ticket Information */}
              <div className="ticket-info">
                <div className="info-row">
                  <span className="info-label">Department</span>
                  <span>{ticket.departmentId?.name || "Not available"}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Priority</span>

                  <span
                    className={`priority-badge ${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Location</span>
                  <span>{ticket.location}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Category</span>
                  <span>{ticket.category}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="ticket-footer">
                <span className="created-date">
                  Created{" "}
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <button
                  className="view-details-btn"
                  onClick={() =>
                    navigate(`/tickets/${ticket._id}`, {
                      state: { fromAdmin: false },
                    })
                  }
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
