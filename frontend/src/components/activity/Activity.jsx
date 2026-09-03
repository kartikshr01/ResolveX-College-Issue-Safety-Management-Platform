import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Activity.module.css";
import { getMyActivity } from "../../services/activity.service";

function Activity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyActivity();

        console.log("ACTIVITY API DATA:", data);

        setActivities(
          Array.isArray(data)
            ? data.filter((activity) => activity.ticketId)
            : [],
        );
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Unable to load your activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
    <main className={styles.page}>
      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className={styles.message}>
          <p>Loading your activity...</p>
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className={styles.message}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      )}

      {/* =========================
          CONTENT
      ========================= */}

      {!loading && !error && (
        <>
          <div className={styles.header}>
            <div>
              <p className={styles.eyebrow}>YOUR ACTIVITY</p>

              <h1>Activity</h1>

              <p className={styles.subtitle}>
                Track the activity and updates related to your reported issues.
              </p>
            </div>

            <span className={styles.count}>
              {activities.length}{" "}
              {activities.length === 1 ? "Activity" : "Activities"}
            </span>
          </div>

          {activities.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📋</div>

              <h2>No activity yet</h2>

              <p>
                Activity related to your reported issues will appear here.
              </p>

              <button
                className={styles.backButton}
                onClick={() => navigate("/safety")}
              >
                Back to Safety Feed
              </button>
            </div>
          ) : (
            <div className={styles.list}>
              {activities.map((activity) => {
                const ticket = activity.ticketId;

                return (
                  <article key={activity._id} className={styles.card}>
                    <div className={styles.timeline}>
                      <div className={styles.dot}></div>
                      <div className={styles.line}></div>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.topRow}>
                        <span className={styles.action}>
                          {activity.action?.replaceAll("_", " ")}
                        </span>

                        <span className={styles.date}>
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>

                      <h2>
                        {activity.message ||
                          "Activity recorded for your ticket."}
                      </h2>

                      {ticket && (
                        <div className={styles.ticketInfo}>
                          <div>
                            <span>Ticket</span>
                            <strong>{ticket.title}</strong>
                          </div>

                          {ticket.category && (
                            <div>
                              <span>Category</span>
                              <strong>{ticket.category}</strong>
                            </div>
                          )}

                          {ticket.status && (
                            <div>
                              <span>Status</span>
                              <strong className={styles.status}>
                                {ticket.status}
                              </strong>
                            </div>
                          )}
                        </div>
                      )}

                      {ticket?._id && (
                        <button
                          className={styles.viewButton}
                          onClick={() =>
                            navigate(`/safety/${ticket._id}`, {
                              state: {
                                issue: ticket,
                                from: "/activity",
                              },
                            })
                          }
                        >
                          View Ticket →
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Activity;