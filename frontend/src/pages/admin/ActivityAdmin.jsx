import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ActivityAdmin.module.css";
import api from "../../services/api";

function AdminActivity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/activity/admin");

        console.log("ADMIN ACTIVITY API DATA:", response.data);

        const data = response.data?.data || response.data;

        setActivities(
          Array.isArray(data)
            ? data.filter((activity) => activity.ticketId)
            : []
        );
      } catch (err) {
        console.error("Failed to fetch admin activities:", err);
        setError("Unable to load admin activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminActivities();
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
      {/* Loading */}
      {loading && (
        <div className={styles.message}>
          <p>Loading admin activity...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className={styles.message}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          <div className={styles.header}>
            <div>
              <p className={styles.eyebrow}>SYSTEM ACTIVITY</p>

              <h1>Activity</h1>

              <p className={styles.subtitle}>
                Monitor all ticket activity and updates across the system.
              </p>
            </div>

            <span className={styles.count}>
              {activities.length}{" "}
              {activities.length === 1 ? "Activity" : "Activities"}
            </span>
          </div>

          {/* No activity */}
          {activities.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📋</div>

              <h2>No activity yet</h2>

              <p>
                Ticket activity will appear here once actions are performed.
              </p>

              <button
                className={styles.backButton}
                onClick={() => navigate("/admin")}
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div className={styles.list}>
              {activities.map((activity) => {
                const ticket = activity.ticketId;
                const actor = activity.actorId;

                return (
                  <article
                    key={activity._id}
                    className={styles.card}
                  >
                    <div className={styles.timeline}>
                      <div className={styles.dot}></div>
                      <div className={styles.line}></div>
                    </div>

                    <div className={styles.cardContent}>
                      {/* Top row */}
                      <div className={styles.topRow}>
                        <span className={styles.action}>
                          {activity.action?.replaceAll("_", " ")}
                        </span>

                        <span className={styles.date}>
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>

                      {/* Activity message */}
                      <h2>
                        {activity.message ||
                          "Activity recorded for this ticket."}
                      </h2>

                      {/* Actor */}
                      {actor && (
                        <div className={styles.ticketInfo}>
                          <div>
                            <span>Performed By</span>

                            <strong>
                              {actor.name || "Unknown User"}
                            </strong>
                          </div>

                          {actor.role && (
                            <div>
                              <span>Role</span>

                              <strong>{actor.role}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Ticket information */}
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

                          {ticket.priority && (
                            <div>
                              <span>Priority</span>

                              <strong>{ticket.priority}</strong>
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

                      {/* View ticket */}
                      {ticket?._id && (
  <button
    type="button"
    className={styles.viewButton}
    onClick={() =>
      navigate(`/admin/activity/ticket/${ticket._id}`, {
        state: {
          ticket,
          from: "/admin/activity",
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

export default AdminActivity;