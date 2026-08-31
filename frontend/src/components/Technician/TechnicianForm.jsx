import { useEffect, useState } from "react";
import { FiX, FiPlus, FiSave } from "react-icons/fi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  skills: "",
  availability: "Available",
  status: "Active",
};

function TechnicianForm({
  onClose,
  onSubmit,
  technician = null,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(technician);

  useEffect(() => {
    if (technician) {
      setFormData({
        name: technician.name || "",
        email: technician.email || "",
        phone: technician.phone || "",
        department: technician.department || "",
        skills: technician.skills?.join(", ") || "",
        availability: technician.availability || "Available",
        status: technician.status || "Active",
      });
    } else {
      setFormData(initialForm);
    }
  }, [technician]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "At least one skill is required";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="technician-modal">
        <div className="modal-header">
          <div>
            <h2>
              {isEditMode
                ? "Edit Technician"
                : "Add Technician"}
            </h2>

            <p>
              {isEditMode
                ? "Update technician information."
                : "Add a new technician to ResolveX."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* NAME */}
            <div className="form-group">
              <label>
                Name <span>*</span>
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter technician name"
              />

              {errors.name && (
                <small className="form-error">
                  {errors.name}
                </small>
              )}
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>
                Email <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="technician@example.com"
              />

              {errors.email && (
                <small className="form-error">
                  {errors.email}
                </small>
              )}
            </div>

            {/* PHONE */}
            <div className="form-group">
              <label>
                Phone <span>*</span>
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />

              {errors.phone && (
                <small className="form-error">
                  {errors.phone}
                </small>
              )}
            </div>

            {/* DEPARTMENT */}
            <div className="form-group">
              <label>Department</label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">
                  Select department
                </option>

                <option value="IT">IT</option>
                <option value="Electrical">
                  Electrical
                </option>
                <option value="Maintenance">
                  Maintenance
                </option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            {/* SKILLS */}
            <div className="form-group full-width">
              <label>
                Skills <span>*</span>
              </label>

              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Networking, Hardware"
              />

              <small className="field-hint">
                Separate multiple skills using commas.
              </small>

              {errors.skills && (
                <small className="form-error">
                  {errors.skills}
                </small>
              )}
            </div>

            {/* AVAILABILITY */}
            <div className="form-group">
              <label>Availability</label>

              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="Available">
                  Available
                </option>

                <option value="Busy">Busy</option>

                <option value="Unavailable">
                  Unavailable
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              {isEditMode ? <FiSave /> : <FiPlus />}

              {isEditMode
                ? "Save Changes"
                : "Add Technician"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TechnicianForm;