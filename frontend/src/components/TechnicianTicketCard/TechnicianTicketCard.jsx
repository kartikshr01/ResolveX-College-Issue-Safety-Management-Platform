import "./TechnicianTicketCard.css";

function TechnicianTicketCard({ ticket, onClick }) {
  return (
    <article
      className="technician-ticket-card"
      onClick={onClick}
    >

      {/* Image */}
      <div className="ticket-image">

        {ticket.imageUrl ? (
          <img
            src={ticket.imageUrl}
            alt={ticket.title}
          />
        ) : (
          <div className="no-ticket-image">
            No Image
          </div>
        )}

      </div>


      {/* Content */}
      <div className="ticket-card-content">

        {/* Top */}
        <div className="ticket-card-top">

          <span className="ticket-id">
            #{ticket._id?.slice(-6).toUpperCase()}
          </span>

          <span
            className={`status-chip status-${ticket.status?.toLowerCase()}`}
          >
            {ticket.status || "ASSIGNED"}
          </span>

        </div>


        {/* Title */}
        <h3>
          {ticket.title}
        </h3>


        {/* Description */}
        <p className="ticket-description">
          {ticket.description}
        </p>


        {/* Tags */}
        <div className="ticket-tags">

          <span className="category-chip">
            {ticket.category}
          </span>

          <span className="severity-chip">
            {ticket.priority}
          </span>

        </div>


        {/* Bottom */}
        <div className="ticket-card-bottom">

          <span className="ticket-location">
            📍 {ticket.location}
          </span>

          <button
            type="button"
            className="view-ticket-button"
            onClick={(event) => {
              event.stopPropagation();
              onClick(ticket);
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