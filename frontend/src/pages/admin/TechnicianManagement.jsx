import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api from "../../services/api";
import "./TechnicianManagement.css";

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [creating, setCreating] = useState(false);

  // =========================
  // GET TECHNICIANS
  // =========================

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/technicians");

      // Supports common API response formats
      const data =
        response.data?.technicians ||
        response.data?.data ||
        response.data ||
        [];

      setTechnicians(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch technicians:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load technicians. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  // =========================
  // SEARCH + STATUS FILTER
  // =========================

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const name = technician.name || technician.fullName || "";
      const email = technician.email || "";
      const status = String(technician.status || "").toLowerCase();

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [technicians, search, statusFilter]);

  // =========================
  // FORM INPUT
  // =========================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE TECHNICIAN
  // =========================

  const handleCreateTechnician = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");

      await api.post("/admin/technicians", formData);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setShowForm(false);

      // Refresh list after successful creation
      await fetchTechnicians();
    } catch (err) {
      console.error("Failed to create technician:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create technician. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCloseForm = () => {
    if (creating) return;

    setShowForm(false);

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="technician-page">
      <Sidebar />

      <main className="technician-content">
        {/* ================= HEADER ================= */}

        <header className="technician-header">
          <div>
            <p className="technician-eyebrow">MANAGEMENT</p>

            <h1>Technicians</h1>

            <p className="technician-subtitle">
              Manage technician accounts and access.
            </p>
          </div>

          <button
            type="button"
            className="add-technician-btn"
            onClick={() => setShowForm(true)}
          >
            <span>+</span>
            Add Technician
          </button>
        </header>

        {/* ================= TOOLBAR ================= */}

        <section className="technician-toolbar">
          <div className="search-box">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search technicians..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </section>

        {/* ================= TABLE ================= */}

        <section className="technician-table-card">
          <div className="table-header">
            <div>
              <p className="table-eyebrow">TEAM</p>
              <h2>Technician List</h2>
            </div>

            <span className="technician-count">
              {filteredTechnicians.length}{" "}
              {filteredTechnicians.length === 1
                ? "technician"
                : "technicians"}
            </span>
          </div>

          <div className="technician-table-wrapper">
            <table className="technician-table">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* LOADING */}

                {loading && (
                  <tr>
                    <td colSpan="4">
                      <div className="technician-empty">
                        <div className="technician-empty-icon">
                          ◌
                        </div>

                        <h3>Loading technicians...</h3>

                        <p>
                          Please wait while technician data is
                          being loaded.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* ERROR */}

                {!loading && error && (
                  <tr>
                    <td colSpan="4">
                      <div className="technician-empty">
                        <div className="technician-empty-icon">
                          !
                        </div>

                        <h3>Something went wrong</h3>

                        <p>{error}</p>

                        <button
                          type="button"
                          onClick={fetchTechnicians}
                        >
                          Try again
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* EMPTY */}

                {!loading &&
                  !error &&
                  filteredTechnicians.length === 0 && (
                    <tr>
                      <td colSpan="4">
                        <div className="technician-empty">
                          <div className="technician-empty-icon">
                            ♙
                          </div>

                          <h3>
                            {search || statusFilter !== "all"
                              ? "No technicians found"
                              : "No technicians found"}
                          </h3>

                          <p>
                            {search || statusFilter !== "all"
                              ? "Try changing your search or status filter."
                              : "Technician accounts will appear here once they are added."}
                          </p>

                          {!search &&
                            statusFilter === "all" && (
                              <button
                                type="button"
                                onClick={() => setShowForm(true)}
                              >
                                Add your first technician
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  )}

                {/* DATA */}

                {!loading &&
                  !error &&
                  filteredTechnicians.map((technician) => {
                    const id =
                      technician.id ||
                      technician._id ||
                      technician.userId;

                    const name =
                      technician.name ||
                      technician.fullName ||
                      "—";

                    const email = technician.email || "—";

                    const status =
                      technician.status || "inactive";

                    return (
                      <tr key={id}>
                        <td>{name}</td>

                        <td>{email}</td>

                        <td>
                          {status}
                        </td>

                        <td>
                          {/* Update functionality will be added here */}
                          <button
                            type="button"
                            disabled
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= CREATE MODAL ================= */}

        {showForm && (
          <div className="technician-modal-overlay">
            <div className="technician-modal">
              <div className="modal-header">
                <div>
                  <p className="modal-eyebrow">NEW ACCOUNT</p>

                  <h2>Add Technician</h2>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={handleCloseForm}
                  disabled={creating}
                >
                  ×
                </button>
              </div>

              <form
                className="technician-form"
                onSubmit={handleCreateTechnician}
              >
                <div className="form-group">
                  <label htmlFor="technician-name">
                    Full Name
                  </label>

                  <input
                    id="technician-name"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="technician-email">
                    Email Address
                  </label>

                  <input
                    id="technician-email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="technician-password">
                    Password
                  </label>

                  <input
                    id="technician-password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseForm}
                    disabled={creating}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={creating}
                  >
                    {creating
                      ? "Creating..."
                      : "Create Technician"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TechnicianManagement;