import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SafetyDetails.module.css";

function SafetyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const issue = location.state?.issue;

  // Where did the user come from?
  // Activity sends "/activity"
  // Safety Feed sends "/safety"
  const from = location.state?.from || "/safety";

  const handleBack = () => {
    navigate(from);
  };

  if (!issue) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Safety issue not found</h1>

          <p>
            The issue details are no longer available.
          </p>

          <button onClick={() => navigate("/safety")}>
            ← Back to Safety Feed
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
        className={styles.backButton}
        onClick={handleBack}
      >
        ← Back to{" "}
        {from === "/activity" ? "Activity" : "Safety Feed"}
      </button>

      <article className={styles.detailsCard}>
        {/* =========================
            LEFT - INFORMATION
        ========================= */}

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.category}>
              {issue.category}
            </span>

            <span
              className={`${styles.priority} ${
                styles[issue.priority?.toLowerCase()]
              }`}
            >
              {issue.priority}
            </span>
          </div>

          <h1>{issue.title}</h1>

          <div className={styles.status}>
            <span>Status</span>

            <strong>{issue.status}</strong>
          </div>

          <p className={styles.description}>
            {issue.description}
          </p>

          <div className={styles.meta}>
            <div>
              <span>Location</span>

              <strong>{issue.location}</strong>
            </div>

            <div>
              <span>Reported On</span>

              <strong>
                {issue.createdAt
                  ? new Date(issue.createdAt).toLocaleString()
                  : "—"}
              </strong>
            </div>

            <div>
              <span>Last Updated</span>

              <strong>
                {issue.updatedAt
                  ? new Date(issue.updatedAt).toLocaleString()
                  : "—"}
              </strong>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT - IMAGE
        ========================= */}

        {issue.imageUrl ? (
          <div className={styles.imageSection}>
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className={styles.image}
            />
          </div>
        ) : (
          <div className={styles.imageSection}>
            <div className={styles.noImage}>
              <div className={styles.noImageIcon}>
                ▧
              </div>

              <span className={styles.noImageText}>
                No image uploaded
              </span>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

export default SafetyDetails;