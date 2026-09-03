import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./TicketDetails.css";
import TicketStatusWorkflow from "../../components/TicketStatusWorkflow/TicketStatusWorkflow";
import { getTicketById } from "../../services/ticket.service";

function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("ASSIGNED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTicketById(ticketId);

        const data = response?.data || response;

        setTicket(data);

        setStatus(data?.status || "ASSIGNED");
      } catch (err) {
        console.error("Ticket details error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load ticket",
        );
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="ticket-details">
        <div className="ticket-details-loading">Loading ticket...</div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="ticket-details">
        <div className="ticket-details-error">{error}</div>
      </div>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!ticket) {
    return (
      <div className="ticket-details">
        <div className="ticket-details-error">Ticket not found.</div>
      </div>
    );
  }

  return (
    <div className="ticket-details">
      {/* =========================
          HEADER
      ========================= */}

      <div className="ticket-details-header">
        <div>
          <p className="ticket-id">Ticket #{ticket.ticketCode || ticket._id}</p>

          <h1>{ticket.title || "Untitled Ticket"}</h1>
        </div>

        <span className="ticket-details-status">{status}</span>
      </div>

      {/* =========================
          TICKET CONTENT
      ========================= */}

      <div className="ticket-details-content">
        {/* INFORMATION */}

        <section className="ticket-info-card">
          <h2>Ticket Information</h2>

          <div className="ticket-info-row">
            <span>Priority</span>

            <strong>{ticket.priority || "N/A"}</strong>
          </div>

          <div className="ticket-info-row">
            <span>Location</span>

            <strong>{ticket.location || "N/A"}</strong>
          </div>

          <div className="ticket-info-row">
            <span>Category</span>

            <strong>{ticket.category || "N/A"}</strong>
          </div>

          <div className="ticket-info-row">
            <span>Reported On</span>

            <strong>
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </strong>
          </div>
        </section>

        {/* DESCRIPTION */}

        <section className="ticket-description-card">
          <h2>Description</h2>

          <p>{ticket.description || "No description available."}</p>
        </section>
      </div>

      {/* =========================
          STATUS WORKFLOW
      ========================= */}

      <div className="ticket-workflow">
        <TicketStatusWorkflow
          ticketId={ticketId}
          status={status}
          setStatus={setStatus}
        />
      </div>
    </div>
  );
}

export default TicketDetails;
