import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AdminTicketDetails.module.css";

function AdminTicketDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ticket Activity/Dashboard se router state ke through aa raha hai
  const ticket = location.state?.ticket;

  // Jahan se ticket details open hui thi
  const from = location.state?.from || "/admin/activity";

  // Back button
  const handleBack = () => {
    navigate(from);
  };

  // Agar direct URL open ho gaya aur state nahi mili
  if (!ticket) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Ticket not found</h1>

          <p>
            The ticket details are no longer available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/activity")}
          >
            ← Back to Activity
          </button>
        </div>
      </main>
    );
  }

  return (
    <section className={styles.page}>
      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
      >
        ← Back to{" "}
        {from === "/admin" ? "Dashboard" : "Activity"}
      </button>

      {/* =========================
          DETAILS CARD
      ========================= */}

      <article className={styles.detailsCard}>

        {/* =========================
            LEFT INFORMATION
        ========================= */}

        <div className={styles.infoSection}>

          {/* CATEGORY + PRIORITY */}

          <div className={styles.header}>
            <span className={styles.category}>
              {ticket.category || "General"}
            </span>

            <span
              className={`${styles.priority} ${
                ticket.priority
                  ? styles[ticket.priority.toLowerCase()]
                  : ""
              }`}
            >
              {ticket.priority || "—"}
            </span>
          </div>

          {/* TITLE */}

          <h1>
            {ticket.title || "Untitled Ticket"}
          </h1>

          {/* STATUS */}

          <div className={styles.status}>
            <span>Status</span>

            <strong>
              {ticket.status || "—"}
            </strong>
          </div>

          {/* DESCRIPTION */}

          <p className={styles.description}>
            {ticket.description ||
              "No description available."}
          </p>

          {/* =========================
              BASIC META
          ========================= */}

          <div className={styles.meta}>

            <div>
              <span>Location</span>

              <strong>
                {ticket.location || "—"}
              </strong>
            </div>

            <div>
              <span>Reported On</span>

              <strong>
                {ticket.createdAt
                  ? new Date(
                      ticket.createdAt
                    ).toLocaleString("en-IN")
                  : "—"}
              </strong>
            </div>

            <div>
              <span>Last Updated</span>

              <strong>
                {ticket.updatedAt
                  ? new Date(
                      ticket.updatedAt
                    ).toLocaleString("en-IN")
                  : "—"}
              </strong>
            </div>

          </div>

          {/* =========================
              USER / TECHNICIAN
          ========================= */}

          <div className={styles.people}>

            {/* REPORTED BY */}

            <div className={styles.personCard}>
              <span>Reported By</span>

              <strong>
                {ticket.userId?.name ||
                  ticket.userId?.fname
                    ? `${ticket.userId?.fname || ""} ${
                        ticket.userId?.lname || ""
                      }`.trim()
                    : "Unknown User"}
              </strong>

              {ticket.userId?.email && (
                <small>
                  {ticket.userId.email}
                </small>
              )}
            </div>

            {/* ASSIGNED TECHNICIAN */}

            <div className={styles.personCard}>
              <span>Assigned Technician</span>

              <strong>
                {ticket.technicianId?.name ||
                  ticket.technicianId?.fname
                    ? `${ticket.technicianId?.fname || ""} ${
                        ticket.technicianId?.lname || ""
                      }`.trim()
                    : "Not Assigned"}
              </strong>

              {ticket.technicianId?.email && (
                <small>
                  {ticket.technicianId.email}
                </small>
              )}
            </div>

          </div>

        </div>

        {/* =========================
            IMAGE SECTION
        ========================= */}

        <div className={styles.imageSection}>

          {ticket.imageUrl ? (
            <img
              src={ticket.imageUrl}
              alt={ticket.title || "Ticket"}
              className={styles.image}
            />
          ) : (
            <div className={styles.noImage}>
              <div className={styles.noImageIcon}>
                ▧
              </div>

              <span className={styles.noImageText}>
                No image uploaded
              </span>
            </div>
          )}

        </div>

      </article>
    </section>
  );
}

export default AdminTicketDetails;