import "../MyTicket/MyTicket.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../../components/Common/Loading";

const AllTickets_Admin_Only = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [safetyFilter, setSafetyFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  // =========================
  // FETCH ALL TICKETS
  // =========================

  const fetchAllTickets = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(
        "http://localhost:3000/api/tickets/all",
        {
          withCredentials: true,
        },
      );

      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch tickets. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  // =========================
  // GET UNIQUE DEPARTMENTS
  // =========================

  const departments = [
    ...new Set(
      tickets.map((ticket) => ticket.departmentId?.name).filter(Boolean),
    ),
  ].sort();

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredTickets = tickets
    .filter((ticket) => {
      const searchText = searchQuery.toLowerCase();

      const matchesSearch =
        ticket.title?.toLowerCase().includes(searchText) ||
        ticket.description?.toLowerCase().includes(searchText) ||
        ticket.location?.toLowerCase().includes(searchText) ||
        ticket.category?.toLowerCase().includes(searchText) ||
        ticket._id?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "" || ticket.priority === priorityFilter;

      const matchesDepartment =
        departmentFilter === "" ||
        ticket.departmentId?.name === departmentFilter;

      const matchesSafety =
        safetyFilter === "" ||
        (safetyFilter === "true" && ticket.safetyFlag === true) ||
        (safetyFilter === "false" && ticket.safetyFlag === false);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDepartment &&
        matchesSafety
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  // =========================
  // CLEAR FILTERS
  // =========================

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setDepartmentFilter("");
    setSafetyFilter("");
    setSortOrder("newest");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter ||
    priorityFilter ||
    departmentFilter ||
    safetyFilter ||
    sortOrder !== "newest";

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="my-tickets-container">
        <Loading message="Loading all tickets..." />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="my-tickets-container">
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <div className="my-tickets-container">
      {/* ================= HEADER ================= */}

      <div className="my-tickets-header">
        <div>
          <h1>All Tickets</h1>
          <p>Track and manage all submitted issues here.</p>
        </div>

        <div className="ticket-count">
          {filteredTickets.length} of {tickets.length}{" "}
          {tickets.length === 1 ? "Ticket" : "Tickets"}
        </div>
      </div>

      <div className="tickets-header-actions">
        <button
          className="refresh-tickets-btn"
          onClick={() => fetchAllTickets(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>

        <div className="ticket-count">
          {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
        </div>
      </div>
      
      {/* ================= FILTER SECTION ================= */}

      {tickets.length > 0 && (
        <div className="ticket-filters">
          {/* Search */}

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by title, location, category or Ticket ID..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="ticket-search-input"
            />
          </div>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All Statuses</option>

            <option value="OPEN">Open</option>

            <option value="ASSIGNED">Assigned</option>

            <option value="IN_PROGRESS">In Progress</option>

            <option value="RESOLVED">Resolved</option>

            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority Filter */}

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="">All Priorities</option>

            <option value="LOW">Low</option>

            <option value="MEDIUM">Medium</option>

            <option value="HIGH">High</option>

            <option value="CRITICAL">Critical</option>
          </select>

          {/* Department Filter */}

          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
          >
            <option value="">All Departments</option>

            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          {/* Safety Filter */}

          <select
            value={safetyFilter}
            onChange={(event) => setSafetyFilter(event.target.value)}
          >
            <option value="">All Tickets</option>

            <option value="true">Safety Issues Only</option>

            <option value="false">Non-Safety Issues</option>
          </select>

          {/* Sort */}

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="newest">Newest First</option>

            <option value="oldest">Oldest First</option>
          </select>

          {/* Clear Filters */}

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <h2>No tickets found</h2>

          <p>No tickets have been submitted yet.</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        /* ================= NO FILTER RESULTS ================= */

        <div className="empty-state">
          <h2>No matching tickets found</h2>

          <p>Try changing your search or filters.</p>

          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        /* ================= TICKETS GRID ================= */

        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <div className="ticket-card" key={ticket._id}>
              {/* Header */}

              <div className="ticket-header">
                <h3>{ticket.title}</h3>

                <span
                  className={`status-badge ${ticket.status
                    ?.toLowerCase()
                    .replace("_", "-")}`}
                >
                  {ticket.status?.replace("_", " ")}
                </span>
              </div>

              {/* Safety Indicator */}

              {ticket.safetyFlag && (
                <div className="ticket-safety-indicator">⚠ Safety Issue</div>
              )}

              {/* Description */}

              <p className="ticket-description">{ticket.description}</p>

              {/* Ticket Information */}

              <div className="ticket-info">
                {/* Department */}

                <div className="info-row">
                  <span className="info-label">Department</span>

                  <span>{ticket.departmentId?.name || "Not available"}</span>
                </div>

                {/* Priority */}

                <div className="info-row">
                  <span className="info-label">Priority</span>

                  <span
                    className={`priority-badge ${ticket.priority?.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                {/* Location */}

                <div className="info-row">
                  <span className="info-label">Location</span>

                  <span>{ticket.location}</span>
                </div>

                {/* Category */}

                <div className="info-row">
                  <span className="info-label">Category</span>

                  <span>{ticket.category}</span>
                </div>
              </div>

              {/* Footer */}

              <div className="ticket-footer">
                <span className="created-date">
                  Created{" "}
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not available"}
                </span>

                <button
                  className="view-details-btn"
                  onClick={() => {
                    navigate(`/tickets/${ticket._id}`, {
                      state: {
                        fromAdmin: true,
                      },
                    });
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTickets_Admin_Only;
