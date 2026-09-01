import "./TicketDetails.css";

function TicketDetails() {
  return (
    <div className="ticket-details">
      <div className="ticket-details-header">
        <div>
          <p className="ticket-id">Ticket #FIX-001</p>
          <h1>Water Leakage in Block A</h1>
        </div>

        <span className="ticket-details-status">
          Assigned
        </span>
      </div>

      <div className="ticket-details-content">
        <section className="ticket-info-card">
          <h2>Ticket Information</h2>

          <div className="ticket-info-row">
            <span>Priority</span>
            <strong>High</strong>
          </div>

          <div className="ticket-info-row">
            <span>Location</span>
            <strong>Block A</strong>
          </div>

          <div className="ticket-info-row">
            <span>Category</span>
            <strong>Plumbing</strong>
          </div>

          <div className="ticket-info-row">
            <span>Reported On</span>
            <strong>01 Sep 2026</strong>
          </div>
        </section>

        <section className="ticket-description-card">
          <h2>Description</h2>

          <p>
            There is a water leakage problem near the
            first-floor washroom in Block A. Please inspect
            the pipe and resolve the issue.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TicketDetails;