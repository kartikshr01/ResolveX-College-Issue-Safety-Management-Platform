import "./TicketStatusWorkflow.css";

function TicketStatusWorkflow() {
  return (
    <div className="status-workflow">
      <h2>Update Ticket Status</h2>

      <div className="status-options">
        <button className="status-button status-assigned">
          Assigned
        </button>

        <button className="status-button status-progress">
          In Progress
        </button>

        <button className="status-button status-resolved">
          Resolved
        </button>
      </div>
    </div>
  );
}

export default TicketStatusWorkflow;