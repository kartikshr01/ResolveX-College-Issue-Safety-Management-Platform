import "./TicketDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DeleteTicketModal from "../../../components/Common/DeleteTicketModal";
import Loading from "../../../components/Common/Loading";

const TicketDetails = () => {
  // const { id } = useParams();
  const location = useLocation();
  const fromAdmin = location.state?.fromAdmin;
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUpdating, setImageUpdating] = useState(false);
  const [imageMessage, setImageMessage] = useState("");
  const [imageError, setImageError] = useState("");
  // const [deleting, setDeleting] = useState(false);
  // const [deleteError, setDeleteError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const endpoint = fromAdmin
          ? `/api/tickets/admin/${ticketId}`
          : `/api/tickets/my/${ticketId}`;

        const response = await axios.get(`http://localhost:3000${endpoint}`, {
          withCredentials: true,
        });

        setTicket(response.data.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);

        setError(
          error.response?.data?.message || "Failed to fetch ticket details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId, fromAdmin]);

  if (loading) {
    return (
      <div className="ticket-details-container">
        <Loading message="Loading ticket details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-details-container">
        <button
          className="back-btn"
          onClick={() => navigate("/tickets/my-tickets")}
        >
          ← Back to My Tickets
        </button>

        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-container">
        <p className="error-message">Ticket not found.</p>
      </div>
    );
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));

    setImageMessage("");
    setImageError("");
  };

  const handleImageUpdate = async () => {
    if (!selectedImage) {
      setImageError("Please select an image first.");
      return;
    }

    try {
      setImageUpdating(true);
      setImageError("");
      setImageMessage("");

      const formData = new FormData();

      formData.append("image", selectedImage);

      const response = await axios.patch(
        `http://localhost:3000/api/tickets/${ticket._id}/image`,
        formData,
        {
          withCredentials: true,
        },
      );

      // Update ticket state immediately
      setTicket(response.data.data);

      setImageMessage("Image updated successfully!");

      setSelectedImage(null);
      setImagePreview(null);

      // Clear file input
      const fileInput = document.getElementById("update-ticket-image");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error updating image:", error);

      setImageError(error.response?.data?.message || "Failed to update image.");
    } finally {
      setImageUpdating(false);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      setDeleting(true);
      setDeleteError("");

      await axios.delete(`http://localhost:3000/api/tickets/my/${ticketId}`, {
        withCredentials: true,
      });

      navigate("/tickets/my-tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);

      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete ticket. Please try again.",
      );

      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="ticket-details-container">
      {/* Back Button */}

      <button
        className="back-btn"
        onClick={() => navigate("/tickets/my-tickets")}
      >
        ← Back to My Tickets
      </button>

      {/* Ticket Header */}

      <div className="ticket-details-header">
        <div>
          <p className="ticket-id">Ticket ID: {ticket._id}</p>

          <h1>{ticket.title}</h1>

          <div className="header-badges">
            <span
              className={`status-badge ${ticket.status
                .toLowerCase()
                .replace("_", "-")}`}
            >
              {ticket.status.replace("_", " ")}
            </span>

            <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
              {ticket.priority}
            </span>

            {ticket.safetyFlag && (
              <span className="safety-badge">⚠ Safety Issue</span>
            )}
          </div>

          {ticket.status === "OPEN" && !fromAdmin && (
            <div className="ticket-action-buttons">
              <button
                className="edit-ticket-btn"
                onClick={() => navigate(`/tickets/${ticket._id}/edit`)}
                disabled={deleting}
              >
                ✏️ Edit Ticket
              </button>

              <button
                className="delete-ticket-btn"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "🗑️ Delete Ticket"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Error */}
      {deleteError && <div className="delete-error-message">{deleteError}</div>}

      {/* Main Content */}
      <div className="ticket-details-content">
        {/* Left Section */}

        <div className="ticket-main-section">
          {/* Description */}

          <div className="details-card">
            <h2>Description</h2>

            <p className="full-description">{ticket.description}</p>
          </div>

          {/* Image */}

          <div className="details-card">
            <h2>Issue Image</h2>

            {/* Existing Image */}

            {ticket.imageUrl ? (
              <img
                src={ticket.imageUrl}
                alt={ticket.title}
                className="ticket-image"
              />
            ) : (
              <p className="not-assigned">No image attached to this ticket.</p>
            )}

            {/* Only ticket owner can update while OPEN */}

            {ticket.status === "OPEN" && !fromAdmin && (
              <div className="image-update-section">
                <label
                  htmlFor="update-ticket-image"
                  className="image-update-label"
                >
                  {ticket.imageUrl ? "Change Issue Image" : "Add Issue Image"}
                </label>

                <input
                  id="update-ticket-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {/* Preview New Image */}

                {imagePreview && (
                  <div className="image-preview-container">
                    <p>New Image Preview:</p>

                    <img
                      src={imagePreview}
                      alt="New ticket preview"
                      className="ticket-image preview-image"
                    />
                  </div>
                )}

                {/* Success */}

                {imageMessage && (
                  <p className="image-success-message">{imageMessage}</p>
                )}

                {/* Error */}

                {imageError && (
                  <p className="image-error-message">{imageError}</p>
                )}

                {/* Update Button */}

                <button
                  type="button"
                  className="update-image-btn"
                  onClick={handleImageUpdate}
                  disabled={imageUpdating}
                >
                  {imageUpdating
                    ? "Updating Image..."
                    : ticket.imageUrl
                      ? "Update Image"
                      : "Upload Image"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}

        <div className="ticket-sidebar">
          <div className="details-card">
            <h2>Ticket Information</h2>

            <div className="details-list">
              <div className="detail-row">
                <span>Department</span>

                <strong>{ticket.departmentId?.name || "Not assigned"}</strong>
              </div>

              <div className="detail-row">
                <span>Category</span>

                <strong>{ticket.category}</strong>
              </div>

              <div className="detail-row">
                <span>Location</span>

                <strong>{ticket.location}</strong>
              </div>

              <div className="detail-row">
                <span>Priority</span>

                <strong>{ticket.priority}</strong>
              </div>

              <div className="detail-row">
                <span>Status</span>

                <strong>{ticket.status.replace("_", " ")}</strong>
              </div>

              <div className="detail-row">
                <span>Safety Flag</span>

                <strong>{ticket.safetyFlag ? "Yes ⚠" : "No"}</strong>
              </div>
            </div>
          </div>

          {/* Technician */}

          <div className="details-card">
            <h2>Assigned Technician</h2>

            {ticket.technicianId ? (
              <div className="technician-info">
                <p>
                  <strong>{ticket.technicianId.name}</strong>
                </p>

                {ticket.technicianId.email && (
                  <p>{ticket.technicianId.email}</p>
                )}

                {ticket.technicianId.phone && (
                  <p>{ticket.technicianId.phone}</p>
                )}
              </div>
            ) : (
              <p className="not-assigned">No technician assigned yet.</p>
            )}
          </div>

          {/* Dates */}

          <div className="details-card">
            <h2>Timeline</h2>

            <div className="details-list">
              <div className="detail-row">
                <span>Created</span>

                <strong>
                  {new Date(ticket.createdAt).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="detail-row">
                <span>Last Updated</span>

                <strong>
                  {new Date(ticket.updatedAt).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteTicketModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTicket}
        loading={deleting}
        ticketTitle={ticket.title}
      />
    </div>
  );
};

export default TicketDetails;
