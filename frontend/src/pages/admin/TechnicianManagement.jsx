import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import "./TechnicianManagement.css";

const emptyCreateForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  departmentId: "",
};

const emptyEditForm = {
  phone: "",
  status: "active",
  availability: true,
  skills: "",
};

const emptyConvertForm = {
  phone: "",
  departmentId: "",
};

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState("technicians");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [convertForm, setConvertForm] = useState(emptyConvertForm);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [converting, setConverting] = useState(false);

  // --------------------------------------------------
  // FETCH TECHNICIANS, DEPARTMENTS AND USERS
  // --------------------------------------------------

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [technicianResponse, departmentResponse, userResponse] =
        await Promise.all([
          api.get("/admin/technicians"),
          api.get("/admin/departments"),
          api.get("/users"),
        ]);

      console.log("Technician API Response:", technicianResponse.data);

      console.log("Department API Response:", departmentResponse.data);

      console.log("User API Response:", userResponse.data);

      const technicianData =
        technicianResponse.data?.data ||
        technicianResponse.data?.technicians ||
        technicianResponse.data ||
        [];

      const departmentData =
        departmentResponse.data?.data ||
        departmentResponse.data?.departments ||
        departmentResponse.data ||
        [];

      const userData =
        userResponse.data?.data ||
        userResponse.data?.users ||
        userResponse.data ||
        [];

      console.log("Technician Data:", technicianData);
      console.log("Department Data:", departmentData);
      console.log("User Data:", userData);

      setTechnicians(Array.isArray(technicianData) ? technicianData : []);

      setDepartments(Array.isArray(departmentData) ? departmentData : []);

      setStudents(
        Array.isArray(userData)
          ? userData.filter((user) => user.role?.toUpperCase() === "STUDENT")
          : [],
      );
    } catch (err) {
      console.error("Failed to load technician management data:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --------------------------------------------------
  // FILTER TECHNICIANS
  // --------------------------------------------------

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const name = technician.name || technician.userId?.name || "";

      const email = technician.email || technician.userId?.email || "";

      const status = String(technician.status || "inactive").toLowerCase();

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [technicians, search, statusFilter]);

  // --------------------------------------------------
  // FILTER STUDENTS
  // --------------------------------------------------

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.name || "";
      const email = student.email || "";
      const searchValue = search.trim().toLowerCase();

      return (
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue)
      );
    });
  }, [students, search]);

  // --------------------------------------------------
  // CREATE FORM INPUT
  // --------------------------------------------------

  const handleCreateInput = (event) => {
    const { name, value } = event.target;

    setCreateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // EDIT FORM INPUT
  // --------------------------------------------------

  const handleEditInput = (event) => {
    const { name, value, type, checked } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------------------------
  // CONVERT FORM INPUT
  // --------------------------------------------------

  const handleConvertInput = (event) => {
    const { name, value } = event.target;

    setConvertForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // CREATE TECHNICIAN
  // --------------------------------------------------

  const handleCreateTechnician = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");

      const payload = {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        phone: Number(createForm.phone),
        departmentId: createForm.departmentId,
      };

      console.log("CREATE TECHNICIAN PAYLOAD:", payload);

      await api.post("/admin/technicians", payload);

      setCreateForm(emptyCreateForm);
      setShowPassword(false);
      setShowCreateModal(false);

      await fetchData();
    } catch (err) {
      console.error("Failed to create technician:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create technician.",
      );
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------------------------
  // OPEN EDIT TECHNICIAN MODAL
  // --------------------------------------------------

  const handleEditTechnician = (technician) => {
    setSelectedTechnician(technician);

    setEditForm({
      phone: technician.phone || "",
      status: technician.status || "active",
      availability:
        technician.availability !== undefined ? technician.availability : true,
      skills: Array.isArray(technician.skills)
        ? technician.skills.join(", ")
        : "",
    });

    setError("");
    setShowEditModal(true);
  };

  // --------------------------------------------------
  // UPDATE TECHNICIAN
  // --------------------------------------------------

  const handleUpdateTechnician = async (event) => {
    event.preventDefault();

    if (!selectedTechnician) return;

    try {
      setUpdating(true);
      setError("");

      const userId =
        selectedTechnician.userId?._id ||
        selectedTechnician.userId ||
        selectedTechnician._id ||
        selectedTechnician.id;

      if (!userId) {
        throw new Error("Technician user ID not found.");
      }

      const payload = {
        phone: Number(editForm.phone),
        status: editForm.status,
        availability: editForm.availability,
        skills: editForm.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      console.log("UPDATE TECHNICIAN USER ID:", userId);

      console.log("UPDATE TECHNICIAN PAYLOAD:", payload);

      await api.patch(`/admin/technicians/${userId}`, payload);

      setShowEditModal(false);
      setSelectedTechnician(null);
      setEditForm(emptyEditForm);

      await fetchData();
    } catch (err) {
      console.error("Failed to update technician:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to update technician.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // OPEN CONVERT STUDENT MODAL
  // --------------------------------------------------

  const handleOpenConvert = (student) => {
    setSelectedStudent(student);
    setConvertForm(emptyConvertForm);
    setError("");
    setShowConvertModal(true);
  };

  // --------------------------------------------------
  // CONVERT STUDENT TO TECHNICIAN
  // --------------------------------------------------

  const handleConvertStudent = async (event) => {
    event.preventDefault();

    if (!selectedStudent) return;

    if (!convertForm.departmentId) {
      setError(
        "Department is required when converting a student to a technician.",
      );
      return;
    }

    try {
      setConverting(true);
      setError("");

      const userId = selectedStudent._id || selectedStudent.id;

      if (!userId) {
        throw new Error("Student user ID not found.");
      }

      const payload = {
        phone: Number(convertForm.phone),
        departmentId: convertForm.departmentId,
      };

      console.log("CONVERT STUDENT USER ID:", userId);

      console.log("CONVERT STUDENT PAYLOAD:", payload);

      await api.patch(`/admin/technicians/${userId}`, payload);

      setShowConvertModal(false);
      setSelectedStudent(null);
      setConvertForm(emptyConvertForm);

      await fetchData();

      setActiveTab("technicians");
    } catch (err) {
      console.error("Failed to convert student:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to convert student to technician.",
      );
    } finally {
      setConverting(false);
    }
  };

  // --------------------------------------------------
  // CLOSE CREATE MODAL
  // --------------------------------------------------

  const closeCreateModal = () => {
    if (creating) return;

    setShowCreateModal(false);
    setCreateForm(emptyCreateForm);
    setShowPassword(false);
    setError("");
  };

  // --------------------------------------------------
  // CLOSE EDIT MODAL
  // --------------------------------------------------

  const closeEditModal = () => {
    if (updating) return;

    setShowEditModal(false);
    setSelectedTechnician(null);
    setEditForm(emptyEditForm);
    setError("");
  };

  // --------------------------------------------------
  // CLOSE CONVERT MODAL
  // --------------------------------------------------

  const closeConvertModal = () => {
    if (converting) return;

    setShowConvertModal(false);
    setSelectedStudent(null);
    setConvertForm(emptyConvertForm);
    setError("");
  };

  return (
    <main className="technician-content">
      {/* PAGE HEADER */}
      <header className="technician-header">
        <div>
          <p className="technician-eyebrow">MANAGEMENT</p>

          <h1>Technician Management</h1>

          <p className="technician-subtitle">
            Manage technicians and convert student accounts into technicians.
          </p>
        </div>

        <button
          type="button"
          className="add-technician-btn"
          onClick={() => {
            setError("");
            setCreateForm(emptyCreateForm);
            setShowPassword(false);
            setShowCreateModal(true);
          }}
        >
          <span>+</span>
          Add Technician
        </button>
      </header>

      {/* TABS */}
      <section className="technician-tabs">
        <button
          type="button"
          className={`technician-tab ${
            activeTab === "technicians" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("technicians");
            setSearch("");
            setStatusFilter("all");
          }}
        >
          Technicians
          <span>{technicians.length}</span>
        </button>

        <button
          type="button"
          className={`technician-tab ${
            activeTab === "students" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("students");
            setSearch("");
          }}
        >
          Students
          <span>{students.length}</span>
        </button>
      </section>

      {/* TOOLBAR */}
      <section className="technician-toolbar">
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder={
              activeTab === "technicians"
                ? "Search technicians..."
                : "Search students..."
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {activeTab === "technicians" && (
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>
          </select>
        )}
      </section>

      {/* TABLE */}
      <section className="technician-table-card">
        <div className="table-header">
          <div>
            <p className="table-eyebrow">
              {activeTab === "technicians" ? "TEAM" : "USERS"}
            </p>

            <h2>
              {activeTab === "technicians" ? "Technician List" : "Student List"}
            </h2>
          </div>

          <span className="technician-count">
            {activeTab === "technicians"
              ? `${filteredTechnicians.length} technicians`
              : `${filteredStudents.length} students`}
          </span>
        </div>

        <div className="technician-table-wrapper">
          <table className="technician-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>

                {activeTab === "technicians" && <th>Status</th>}

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading && (
                <tr>
                  <td colSpan={activeTab === "technicians" ? 5 : 4}>
                    <div className="technician-empty">
                      <div className="technician-empty-icon">◌</div>

                      <h3>Loading data...</h3>

                      <p>Please wait while data is being loaded.</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {!loading && error && (
                <tr>
                  <td colSpan={activeTab === "technicians" ? 5 : 4}>
                    <div className="technician-empty">
                      <div className="technician-empty-icon">!</div>

                      <h3>Something went wrong</h3>

                      <p>{error}</p>

                      <button type="button" onClick={fetchData}>
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* EMPTY TECHNICIANS */}
              {!loading &&
                !error &&
                activeTab === "technicians" &&
                filteredTechnicians.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="technician-empty">
                        <div className="technician-empty-icon">♙</div>

                        <h3>No technicians found</h3>

                        <p>No technician matches your current search.</p>
                      </div>
                    </td>
                  </tr>
                )}

              {/* TECHNICIANS */}
              {!loading &&
                !error &&
                activeTab === "technicians" &&
                filteredTechnicians.map((technician) => {
                  const id = technician._id || technician.id;

                  const name =
                    technician.name || technician.userId?.name || "—";

                  const email =
                    technician.email || technician.userId?.email || "—";

                  const role = technician.userId?.role || "TECHNICIAN";

                  const status = technician.status || "inactive";

                  return (
                    <tr key={id}>
                      <td>{name}</td>

                      <td>{email}</td>

                      <td>
                        <span className="role-badge">{role}</span>
                      </td>

                      <td>
                        <span
                          className={`technician-status ${String(
                            status,
                          ).toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="technician-action-btn"
                          onClick={() => handleEditTechnician(technician)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {/* EMPTY STUDENTS */}
              {!loading &&
                !error &&
                activeTab === "students" &&
                filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <div className="technician-empty">
                        <div className="technician-empty-icon">♙</div>

                        <h3>No students found</h3>

                        <p>
                          Student accounts will appear here after registration.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              {/* STUDENTS */}
              {!loading &&
                !error &&
                activeTab === "students" &&
                filteredStudents.map((student) => (
                  <tr key={student._id || student.id}>
                    <td>{student.name || "—"}</td>

                    <td>{student.email || "—"}</td>

                    <td>
                      <span className="role-badge student">STUDENT</span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="make-technician-btn"
                        onClick={() => handleOpenConvert(student)}
                      >
                        Make Technician
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE TECHNICIAN MODAL */}
      {showCreateModal && (
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
                onClick={closeCreateModal}
                disabled={creating}
              >
                ×
              </button>
            </div>

            <form className="technician-form" onSubmit={handleCreateTechnician}>
              {/* NAME */}
              <div className="form-group">
                <label htmlFor="create-name">Full Name</label>

                <input
                  id="create-name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={createForm.name}
                  onChange={handleCreateInput}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="create-email">Email</label>

                <input
                  id="create-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={createForm.email}
                  onChange={handleCreateInput}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label htmlFor="create-password">Password</label>

                <div className="password-input-wrapper">
                  <input
                    id="create-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={createForm.password}
                    onChange={handleCreateInput}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="create-phone">Phone</label>

                <input
                  id="create-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={createForm.phone}
                  onChange={handleCreateInput}
                  required
                />
              </div>

              {/* DEPARTMENT */}
              <div className="form-group">
                <label htmlFor="create-department">Department</label>

                <select
                  id="create-department"
                  name="departmentId"
                  value={createForm.departmentId}
                  onChange={handleCreateInput}
                  required
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeCreateModal}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn" disabled={creating}>
                  {creating ? "Creating..." : "Create Technician"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TECHNICIAN MODAL */}
      {showEditModal && (
        <div className="technician-modal-overlay">
          <div className="technician-modal">
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">TECHNICIAN</p>

                <h2>Edit Technician</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeEditModal}
                disabled={updating}
              >
                ×
              </button>
            </div>

            <form className="technician-form" onSubmit={handleUpdateTechnician}>
              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="edit-phone">Phone</label>

                <input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={handleEditInput}
                />
              </div>

              {/* SKILLS */}
              <div className="form-group">
                <label htmlFor="edit-skills">Skills</label>

                <input
                  id="edit-skills"
                  name="skills"
                  type="text"
                  placeholder="Electrical, Network, Hardware"
                  value={editForm.skills}
                  onChange={handleEditInput}
                />
              </div>

              {/* STATUS */}
              <div className="form-group">
                <label htmlFor="edit-status">Status</label>

                <select
                  id="edit-status"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInput}
                >
                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* AVAILABILITY */}
              <label className="availability-field">
                <input
                  name="availability"
                  type="checkbox"
                  checked={editForm.availability}
                  onChange={handleEditInput}
                />

                <span>Available for tickets</span>
              </label>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeEditModal}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn" disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT STUDENT MODAL */}
      {showConvertModal && (
        <div className="technician-modal-overlay">
          <div className="technician-modal">
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">ROLE MANAGEMENT</p>

                <h2>Make Technician</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeConvertModal}
                disabled={converting}
              >
                ×
              </button>
            </div>

            <form className="technician-form" onSubmit={handleConvertStudent}>
              {/* STUDENT PREVIEW */}
              <div className="student-preview">
                <span>Student</span>

                <strong>{selectedStudent?.name}</strong>

                <p>{selectedStudent?.email}</p>
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="convert-phone">Phone</label>

                <input
                  id="convert-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter technician phone number"
                  value={convertForm.phone}
                  onChange={handleConvertInput}
                  required
                />
              </div>

              {/* DEPARTMENT */}
              <div className="form-group">
                <label htmlFor="convert-department">Department</label>

                <select
                  id="convert-department"
                  name="departmentId"
                  value={convertForm.departmentId}
                  onChange={handleConvertInput}
                  required
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeConvertModal}
                  disabled={converting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={converting}
                >
                  {converting ? "Converting..." : "Make Technician"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default TechnicianManagement;
