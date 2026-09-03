import "./TechnicianTicketCard.css";

function TechnicianTicketCard({ ticket, onClick }) {
  return (
    <article className="technician-ticket-card">
      {/* Image */}
      <div className="ticket-image">
        {ticket.image ? (
          <img src={ticket.image} alt={ticket.title} />
        ) : (
          <div className="no-ticket-image">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="ticket-card-content">
        <div className="ticket-card-top">
          <span className="ticket-id">#{ticket.id}</span>

          <span className="status-chip">{ticket.status || "Assigned"}</span>
        </div>

        <h3>{ticket.title}</h3>

        <p className="ticket-description">{ticket.description}</p>

        {/* Tags */}
        <div className="ticket-tags">
          <span className="category-chip">{ticket.category}</span>

          <span className="severity-chip">{ticket.priority}</span>
        </div>

        {/* Bottom */}
        <div className="ticket-card-bottom">
          <span className="ticket-location">📍 {ticket.location}</span>

          <button
            className="view-ticket-button"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
          >
            View Ticket →
          </button>
        </div>
      </div>
    </article>
  );
}

export default TechnicianTicketCard;
