import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./TicketDetailsModal.module.css";

function TicketDetailsModal({
  ticketId,
  onClose,
}) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");
        setTicket(null);

        const response = await api.get(
          `/tickets/notification/${ticketId}`,
        );

        console.log(
          "Notification ticket response:",
          response.data,
        );

        setTicket(response.data?.data || null);
      } catch (err) {
        console.error(
          "Failed to fetch notification ticket:",
          err,
        );

        setError(
          err.response?.data?.message ||
            "Unable to load ticket details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (!ticketId) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
      >
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              Ticket Details
            </span>

            <h2 id="ticket-modal-title">
              {ticket?.title || "Ticket"}
            </h2>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close ticket details"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {loading ? (
            <div className={styles.state}>
              Loading ticket details...
            </div>
          ) : error ? (
            <div className={styles.state}>
              {error}
            </div>
          ) : !ticket ? (
            <div className={styles.state}>
              Ticket not found.
            </div>
          ) : (
            <>
              {ticket.imageUrl && (
                <div className={styles.imageWrapper}>
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.title || "Ticket"}
                    className={styles.image}
                  />
                </div>
              )}

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    Status
                  </span>

                  <span className={styles.value}>
                    {ticket.status || "OPEN"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    Priority
                  </span>

                  <span className={styles.value}>
                    {ticket.priority || "Not specified"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    Department
                  </span>

                  <span className={styles.value}>
                    {ticket.departmentId?.name ||
                      "Not assigned"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    Technician
                  </span>

                  <span className={styles.value}>
                    {ticket.technicianId?.name ||
                      "Not assigned"}
                  </span>
                </div>
              </div>

              <div className={styles.description}>
                <span className={styles.label}>
                  Description
                </span>

                <p>
                  {ticket.description ||
                    "No description provided."}
                </p>
              </div>

              {ticket.location && (
                <div className={styles.description}>
                  <span className={styles.label}>
                    Location
                  </span>

                  <p>{ticket.location}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketDetailsModal;