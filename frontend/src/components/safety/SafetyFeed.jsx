import { useEffect, useState } from "react";
import { getPublicSafetyIssues } from "../../services/safetyService";
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
        setIssues(data);
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
        <p>Loading safety issues...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.container}>
        <p>{error}</p>
      </section>
    );
  }

  if (issues.length === 0) {
    return (
      <section className={styles.container}>
        <h2>Safety Feed</h2>
        <p>No safety issues reported.</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>COMMUNITY SAFETY</p>
          <h1>Safety Feed</h1>
          <p className={styles.subtitle}>
            Stay updated with active safety issues in your community.
          </p>
        </div>

        <span className={styles.count}>
          {issues.length} {issues.length === 1 ? "Issue" : "Issues"}
        </span>
      </div>

      <div className={styles.feed}>
        {issues.map((issue) => (
          <SafetyCard key={issue._id} issue={issue} />
        ))}
      </div>
    </section>
  );
}

export default SafetyFeed;