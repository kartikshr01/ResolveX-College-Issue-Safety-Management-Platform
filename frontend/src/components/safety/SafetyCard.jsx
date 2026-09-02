import { useNavigate } from "react-router-dom";
import styles from "./SafetyCard.module.css";

function SafetyCard({ issue }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/safety/${issue._id}`, {
      state: {
        issue,
        from: "/safety",
      },
    });
  };

  const priorityClass =
    styles[issue.priority?.toLowerCase()] || "";

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div className={styles.imageWrapper}>
        {issue.imageUrl ? (
          <img
            src={issue.imageUrl}
            alt={issue.title || "Safety issue"}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage}>
            <span className={styles.noImageText}>
              No image uploaded
            </span>
          </div>
        )}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className={styles.content}>
        {/* =================================================
            CATEGORY + PRIORITY
        ================================================= */}

        <div className={styles.topRow}>
          <span className={styles.category}>
            {issue.category || "General"}
          </span>

          {issue.priority && (
            <span
              className={`${styles.priority} ${priorityClass}`}
            >
              {issue.priority}
            </span>
          )}
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h2 className={styles.title}>
          {issue.title}
        </h2>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p className={styles.description}>
          {issue.description || "No description provided."}
        </p>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className={styles.bottomRow}>
          <div className={styles.location}>
            <span className={styles.locationDot}>•</span>

            <span>
              {issue.location || "Location not specified"}
            </span>
          </div>

          <span className={styles.status}>
            {issue.status || "Reported"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default SafetyCard;