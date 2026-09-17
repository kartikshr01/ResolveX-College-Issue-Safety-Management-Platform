import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../EditTickets/EditTickets.css";    

function EditTicket() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: "",
    category: "",
    location: "",
    priority: "",
    safetyFlag: false,
  });

  // Fetch existing ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `https://resolvex-backend-01f9.onrender.com/api/tickets/my/${ticketId}`,
          {
            withCredentials: true,
          },
        );

        const ticket = response.data.data;

        // Only OPEN tickets can be edited
        if (ticket.status !== "OPEN") {
          setError("Only OPEN tickets can be edited.");
          return;
        }

        setFormData({
          title: ticket.title || "",
          description: ticket.description || "",

          // departmentId may be populated object or plain ID
          departmentId:
            ticket.departmentId?._id ||
            ticket.departmentId ||
            "",

          category: ticket.category || "",
          location: ticket.location || "",
          priority: ticket.priority || "",
          safetyFlag: ticket.safetyFlag || false,
        });
      } catch (err) {
        console.error("Error loading ticket:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load ticket information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // Update ticket
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await axios.patch(
        `https://resolvex-backend-01f9.onrender.com/api/tickets/${ticketId}`,
        formData,
        {
          withCredentials: true,
        },
      );

      console.log("Ticket updated:", response.data);

      navigate(`/tickets/${ticketId}`);
    } catch (err) {
      console.error("Error updating ticket:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update ticket.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="edit-ticket-container">
        <p className="loading-message">
          Loading ticket information...
        </p>
      </div>
    );
  }

  // Error while loading ticket
  if (error && !formData.title) {
    return (
      <div className="edit-ticket-container">
        <button
          className="edit-back-btn"
          onClick={() =>
            navigate(`/tickets/${ticketId}`)
          }
        >
          ← Back to Ticket
        </button>

        <p className="error-message">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="edit-ticket-container">

      {/* Header */}

      <div className="edit-ticket-header">

        <button
          className="edit-back-btn"
          onClick={() =>
            navigate(`/tickets/${ticketId}`)
          }
        >
          ← Back to Ticket
        </button>

        <h1>Edit Ticket</h1>

        <p>
          Update your ticket details. Changes are
          allowed only while the ticket is OPEN.
        </p>

      </div>

      {/* Error */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}

      <form
        className="edit-ticket-form"
        onSubmit={handleSubmit}
      >

        {/* Title */}

        <div className="form-group">

          <label htmlFor="title">
            Issue Title <span>*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            minLength={5}
            maxLength={150}
            required
          />

        </div>

        {/* Description */}

        <div className="form-group">

          <label htmlFor="description">
            Description <span>*</span>
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            minLength={10}
            maxLength={2000}
            required
          />

        </div>

        {/* Location */}

        <div className="form-group">

          <label htmlFor="location">
            Location <span>*</span>
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            maxLength={200}
            required
          />

        </div>

        {/* Department */}

        <div className="form-group">

          <label htmlFor="departmentId">
            Department <span>*</span>
          </label>

          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >

            <option value="">
              Select a department
            </option>

            <option value="6a8d3cfd07eee994e9f60199">
              Electrical
            </option>

            <option value="6a8d3cfd07eee994e9f6019a">
              Plumbing
            </option>

            <option value="6a8d3cfd07eee994e9f6019b">
              IT Support
            </option>

            <option value="6a8d3cfd07eee994e9f6019d">
              Housekeeping
            </option>

            <option value="6a8d3cfd07eee994e9f6019c">
              General Maintenance and Infrastructure
            </option>

            <option value="6a8d3cfd07eee994e9f6019e">
              Security
            </option>

            <option value="6a8d3cfd07eee994e9f6019f">
              General Maintenance
            </option>

          </select>

        </div>

        {/* Category */}

        <div className="form-group">

          <label htmlFor="category">
            Category <span>*</span>
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >

            <option value="">
              Select a category
            </option>

            <option value="electrical">
              Electrical
            </option>

            <option value="plumbing">
              Plumbing
            </option>

            <option value="it">
              IT
            </option>

            <option value="furniture">
              Furniture
            </option>

            <option value="cleanliness">
              Cleanliness
            </option>

            <option value="infrastructure">
              Infrastructure
            </option>

            <option value="other">
              Other
            </option>

          </select>

        </div>

        {/* Priority */}

        <div className="form-group">

          <label htmlFor="priority">
            Priority <span>*</span>
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >

            <option value="">
              Select priority
            </option>

            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="CRITICAL">
              Critical
            </option>

          </select>

        </div>

        {/* Safety Flag */}

        <div className="safety-checkbox">

          <input
            id="safetyFlag"
            name="safetyFlag"
            type="checkbox"
            checked={formData.safetyFlag}
            onChange={handleChange}
          />

          <label htmlFor="safetyFlag">
            ⚠ This issue may create a safety risk
          </label>

        </div>

        {/* Actions */}

        <div className="edit-ticket-actions">

          <button
            type="button"
            className="cancel-edit-btn"
            disabled={submitting}
            onClick={() =>
              navigate(`/tickets/${ticketId}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-ticket-btn"
            disabled={submitting}
          >
            {submitting
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditTicket;