import { useEffect, useState } from "react";

import "./TechnicianHistory.css";

import {
  getTechnicianHistory,
} from "../../../services/ticket.service";

function TechnicianHistory() {
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================
     FETCH HISTORY
  ========================= */

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTechnicianHistory();

        const data =
          response?.data || response || [];

        setTickets(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Technician history error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load resolution history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="technician-history-page">
        <div className="technician-history-loading">
          Loading resolution history...
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="technician-history-page">
        <div className="technician-history-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="technician-history-page">

      {/* =====================
          HEADER
      ===================== */}

      <div className="technician-history-header">

        <div>
          <p className="technician-history-eyebrow">
            TECHNICIAN RECORDS
          </p>

          <h1>
            Resolution History
          </h1>

          <p className="technician-history-subtitle">
            View issues that you have successfully
            resolved.
          </p>
        </div>

        <div className="technician-history-count">

          <strong>
            {tickets.length}
          </strong>

          <span>
            {tickets.length === 1
              ? "Resolved"
              : "Resolved Tickets"}
          </span>

        </div>

      </div>


      {/* =====================
          EMPTY STATE
      ===================== */}

      {tickets.length === 0 ? (

        <div className="technician-history-empty">

          <div className="technician-history-empty-icon">
            ✓
          </div>

          <h2>
            No Resolved Issues
          </h2>

          <p>
            Your resolved tickets will appear
            here.
          </p>

        </div>

      ) : (

        /* =====================
           HISTORY LIST
        ===================== */

        <div className="technician-history-list">

          {tickets.map((ticket) => (

            <article
              className="technician-history-card"
              key={ticket._id}
            >

              {/* IMAGE */}

              <div className="technician-history-image">

                {ticket.imageUrl ? (

                  <img
                    src={ticket.imageUrl}
                    alt={
                      ticket.title ||
                      "Resolved issue"
                    }
                  />

                ) : (

                  <div className="technician-history-image-placeholder">
                    No Image
                  </div>

                )}

              </div>


              {/* CONTENT */}

              <div className="technician-history-content">

                <div className="technician-history-top">

                  <span className="technician-history-ticket-id">
                    #
                    {ticket.ticketCode ||
                      ticket._id}
                  </span>

                  <span className="technician-history-status">
                    RESOLVED
                  </span>

                </div>


                <h2>
                  {ticket.title ||
                    "Untitled Issue"}
                </h2>


                <p className="technician-history-description">

                  {ticket.description ||
                    "No description available."}

                </p>


                <div className="technician-history-meta">

                  <span>
                    {ticket.category ||
                      "General"}
                  </span>

                  <span>
                    {ticket.priority ||
                      "Normal"}
                  </span>

                  <span>
                    📍{" "}
                    {ticket.location ||
                      "Location unavailable"}
                  </span>

                </div>


                <div className="technician-history-date">

                  <span>
                    Resolved On
                  </span>

                  <strong>
                    {formatDate(
                      ticket.updatedAt
                    )}
                  </strong>

                </div>

              </div>

            </article>

          ))}

        </div>
      )}

    </div>
  );
}

export default TechnicianHistory;