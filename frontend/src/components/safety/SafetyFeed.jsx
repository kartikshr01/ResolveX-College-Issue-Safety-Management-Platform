import { useEffect, useState } from "react";
import { getPublicSafetyIssues } from "../../services/safety.service";
import SafetyCard from "./SafetyCard";
import styles from "./SafetyFeed.module.css";

function SafetyFeed() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicSafetyIssues();

        // =========================
        // PRIORITY ORDER
        // Critical → High → Medium → Low
        // =========================
        const priorityOrder = {
          critical: 1,
          high: 2,
          medium: 3,
          low: 4,
        };

        const sortedIssues = [...data].sort((a, b) => {
          const priorityA =
            priorityOrder[a.priority?.toLowerCase()] || 99;

          const priorityB =
            priorityOrder[b.priority?.toLowerCase()] || 99;

          return priorityA - priorityB;
        });

        setIssues(sortedIssues);
      } catch (err) {
        console.error("Failed to fetch safety issues:", err);
        setError("Unable to load safety issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.message}>
          <p>Loading safety issues...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.message}>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>COMMUNITY SAFETY</p>

          <h1>Safety Feed</h1>

          <p className={styles.subtitle}>
            Stay updated with active safety issues in your community.
          </p>
        </div>

        <span className={styles.count}>
          {issues.length}{" "}
          {issues.length === 1 ? "Issue" : "Issues"}
        </span>
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {issues.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyMark}>✓</div>

          <h2>No safety issues reported</h2>

          <p>
            There are currently no active safety issues in your
            community.
          </p>
        </div>
      ) : (
        /* =========================
           SAFETY CARDS
        ========================= */

        <div className={styles.feed}>
          {issues.map((issue) => (
            <SafetyCard
              key={issue._id}
              issue={issue}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SafetyFeed;