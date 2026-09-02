import "./TicketStatusWorkflow.css";

function TicketStatusWorkflow({ status, setStatus }) {

  return (
    <div className="status-workflow">

      <h2>Update Ticket Status</h2>

      <div className="status-options">

        <button
          className={`status-button status-assigned ${
            status === "Assigned" ? "active" : ""
          }`}
          onClick={() => setStatus("Assigned")}
        >
          Assigned
        </button>

        <button
          className={`status-button status-progress ${
            status === "In Progress" ? "active" : ""
          }`}
          onClick={() => setStatus("In Progress")}
        >
          In Progress
        </button>

        <button
          className={`status-button status-resolved ${
            status === "Resolved" ? "active" : ""
          }`}
          onClick={() => setStatus("Resolved")}
        >
          Resolved
        </button>

      </div>

      <div className="current-status">
        Current Status:
        <span>{status}</span>
      </div>

    </div>
  );
}

export default TicketStatusWorkflow;