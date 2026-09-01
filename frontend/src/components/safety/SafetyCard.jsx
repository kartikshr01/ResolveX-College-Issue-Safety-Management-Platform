import { useNavigate } from "react-router-dom";
import styles from "./SafetyCard.module.css";

function SafetyCard({ issue }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/safety/${issue._id}`, {
      state: { issue },
    });
  };

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {issue.imageUrl && (
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className={styles.image}
        />
      )}

      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.category}>{issue.category}</span>

          <span
            className={`${styles.priority} ${
              styles[issue.priority?.toLowerCase()]
            }`}
          >
            {issue.priority}
          </span>
        </div>

        <h2>{issue.title}</h2>

        <p className={styles.description}>{issue.description}</p>

        <div className={styles.meta}>
          <span>📍 {issue.location}</span>
          <span>{issue.status}</span>
        </div>
      </div>
    </article>
  );
}

export default SafetyCard;