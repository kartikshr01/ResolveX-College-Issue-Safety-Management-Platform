import { useState } from "react";
import Button from "../../../components/Common/Button";
import "./CreateTicket.css";

function CreateTicket() {
  const initialFormData = {
    title: "",
    description: "",
    departmentId: "",
    category: "",
    location: "",
    priority: "",
    safetyFlag: false,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files[0]
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("departmentId", formData.departmentId);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("priority", formData.priority);
      data.append("safetyFlag", formData.safetyFlag);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(
        "https://resolvex-backend-01f9.onrender.com/api/tickets",
        {
          method: "POST",

          // Sends HTTP-only authentication cookies
          credentials: "include",

          // Do NOT manually set Content-Type.
          // FormData automatically sets multipart/form-data
          // with the required boundary.
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create ticket"
        );
      }

      setMessage("Ticket created successfully!");

      setFormData(initialFormData);

      const imageInput =
        document.getElementById("ticket-image");

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="create-ticket-card">

        {/* Header */}
        <div className="create-ticket-header">
          <h1>Report an Issue</h1>

          <p>
            Submit an issue and our team will assign it
            to the appropriate technician.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div
            className="ticket-message success"
            role="alert"
          >
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="ticket-message error"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
              placeholder="Enter the issue title"
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
              placeholder="Describe the issue in detail"
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
              placeholder="Example: Block B, 2nd Floor"
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
          <div className="safety-option">
            <input
              id="safetyFlag"
              name="safetyFlag"
              type="checkbox"
              checked={formData.safetyFlag}
              onChange={handleChange}
            />

            <label htmlFor="safetyFlag">
              <strong>Safety Issue</strong>

              <small>
                Check this if the issue may create a
                safety risk.
              </small>
            </label>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="ticket-image">
              Attach Image
            </label>

            <input
              id="ticket-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />

            <small className="file-help">
              Upload an image showing the issue,
              if available.
            </small>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="submit-ticket-button"
            disabled={loading}
          >
            {loading
              ? "Creating Ticket..."
              : "Submit Ticket"}
          </Button>

        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
