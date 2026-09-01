import { Link } from "react-router-dom";
import "./TechnicianTicketCard.css";

function TechnicianTicketCard() {
  return (
    <div className="technician-ticket-card">
      <div className="ticket-card-header">
        <h3>Ticket #FIX-001</h3>

        <span className="ticket-status">
          Assigned
        </span>
      </div>

      <h4>Water Leakage in Block A</h4>

      <p className="ticket-description">
        There is a water leakage problem near the
        first-floor washroom.
      </p>

      <div className="ticket-card-info">
        <span>
          <strong>Priority:</strong> High
        </span>

        <span>
          <strong>Location:</strong> Block A
        </span>
      </div>

      <Link
        to="/technician/ticket/FIX-001"
        className="view-ticket-button"
      >
        View Ticket
      </Link>
    </div>
  );
}

export default TechnicianTicketCard;