import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SafetyDetails.module.css";

function SafetyDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const issue = state?.issue;

  if (!issue) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Safety issue not found</h1>
          <p>The issue details are no longer available.</p>

          <button onClick={() => navigate("/safety")}>
            Back to Safety Feed
          </button>
        </div>
      </main>
    );
  }

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <section className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/safety")}>
        ← Back to Safety Feed
      </button>

      <article className={styles.detailsCard}>
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.category}>{issue.category}</span>

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

          <p className={styles.description}>{issue.description}</p>

          <div className={styles.meta}>
            <div>
              <span>Location</span>
              <strong>{issue.location}</strong>
            </div>

            <div>
              <span>Reported On</span>
              <strong>{new Date(issue.createdAt).toLocaleString()}</strong>
            </div>

            <div>
              <span>Last Updated</span>
              <strong>{new Date(issue.updatedAt).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {issue.imageUrl && (
          <div className={styles.imageSection}>
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className={styles.image}
            />
          </div>
        )}
      </article>
    </section>
  );
}

export default SafetyDetails;
