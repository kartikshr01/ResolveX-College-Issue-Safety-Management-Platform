import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./TicketDetails.css";

import TicketStatusWorkflow from "../../../components/TicketStatusWorkflow/TicketStatusWorkflow";
import { getTicketById } from "../../../services/ticket.service";

function TicketDetails() {
const { ticketId } = useParams();
const navigate = useNavigate();

// Change this logic if you receive admin information from props/location state.
const fromAdmin = false;

const [ticket, setTicket] = useState(null);
const [status, setStatus] = useState("ASSIGNED");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [imageUpdating, setImageUpdating] = useState(false);
const [imageMessage, setImageMessage] = useState("");
const [imageError, setImageError] = useState("");

const [deleting, setDeleting] = useState(false);
const [deleteError, setDeleteError] = useState("");

/* =========================
FETCH TICKET
========================= */

useEffect(() => {
const fetchTicket = async () => {
try {
setLoading(true);
setError("");

    const response = await getTicketById(ticketId);

    const data = response?.data || response;

    setTicket(data);
    setStatus(data?.status || "ASSIGNED");
  } catch (err) {
    console.error("Ticket details error:", err);

    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to load ticket"
    );
  } finally {
    setLoading(false);
  }
};

if (ticketId) {
  fetchTicket();
}

}, [ticketId]);

/* =========================
IMAGE CHANGE
========================= */

const handleImageChange = (event) => {
const file = event.target.files?.[0];


if (!file) return;

setSelectedImage(file);
setImagePreview(URL.createObjectURL(file));

setImageMessage("");
setImageError("");


};

/* =========================
UPDATE IMAGE
========================= */

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
    }
  );

  const updatedTicket = response?.data?.data || response?.data;

  setTicket(updatedTicket);

  if (updatedTicket?.status) {
    setStatus(updatedTicket.status);
  }

  setImageMessage("Image updated successfully!");

  setSelectedImage(null);
  setImagePreview(null);

  const fileInput = document.getElementById("update-ticket-image");

  if (fileInput) {
    fileInput.value = "";
  }
} catch (err) {
  console.error("Error updating image:", err);

  setImageError(
    err?.response?.data?.message || "Failed to update image."
  );
} finally {
  setImageUpdating(false);
}


};

/* =========================
DELETE TICKET
========================= */

const handleDeleteTicket = async () => {
const confirmed = window.confirm(
"Are you sure you want to delete this ticket? This action cannot be undone."
);


if (!confirmed) return;

try {
  setDeleting(true);
  setDeleteError("");

  await axios.delete(
    `http://localhost:3000/api/tickets/my/${ticket._id}`,
    {
      withCredentials: true,
    }
  );

  navigate("/tickets/my-tickets");
} catch (err) {
  console.error("Error deleting ticket:", err);

  setDeleteError(
    err?.response?.data?.message || "Failed to delete ticket."
  );
} finally {
  setDeleting(false);
}


};

/* =========================
LOADING
========================= */

if (loading) {
return ( <div className="ticket-details"> <div className="ticket-details-loading">
Loading ticket... </div> </div>
);
}

/* =========================
ERROR
========================= */

if (error) {
return ( <div className="ticket-details"> <div className="ticket-details-error">
{error} </div> </div>
);
}

/* =========================
NOT FOUND
========================= */

if (!ticket) {
return ( <div className="ticket-details"> <div className="ticket-details-error">
Ticket not found. </div> </div>
);
}

return ( <div className="ticket-details-container">

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
      <p className="ticket-id">
        Ticket #{ticket.ticketCode || ticket._id}
      </p>

      <h1>{ticket.title}</h1>

      <div className="header-badges">

        <span
          className={`status-badge ${(ticket.status || "")
            .toLowerCase()
            .replace("_", "-")}`}
        >
          {(ticket.status || "N/A").replace("_", " ")}
        </span>

        <span
          className={`priority-badge ${(ticket.priority || "")
            .toLowerCase()}`}
        >
          {ticket.priority || "N/A"}
        </span>

        {ticket.safetyFlag && (
          <span className="safety-badge">
            ⚠ Safety Issue
          </span>
        )}

      </div>

      {/* Owner Actions */}
      {ticket.status === "OPEN" && !fromAdmin && (
        <div className="ticket-action-buttons">

          <button
            className="edit-ticket-btn"
            onClick={() =>
              navigate(`/tickets/${ticket._id}/edit`)
            }
            disabled={deleting}
          >
            ✏️ Edit Ticket
          </button>

          <button
            className="delete-ticket-btn"
            onClick={handleDeleteTicket}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "🗑️ Delete Ticket"}
          </button>

        </div>
      )}
    </div>

    <span className="ticket-details-status">
      {status}
    </span>
  </div>

  {/* Delete Error */}
  {deleteError && (
    <div className="delete-error-message">
      {deleteError}
    </div>
  )}

  {/* Main Content */}
  <div className="ticket-details-content">

    {/* LEFT SECTION */}
    <div className="ticket-main-section">

      {/* Ticket Information */}
      <section className="ticket-info-card">
        <h2>Ticket Information</h2>

        <div className="ticket-info-row">
          <span>Priority</span>
          <strong>{ticket.priority || "N/A"}</strong>
        </div>

        <div className="ticket-info-row">
          <span>Location</span>
          <strong>{ticket.location || "N/A"}</strong>
        </div>

        <div className="ticket-info-row">
          <span>Category</span>
          <strong>{ticket.category || "N/A"}</strong>
        </div>

        <div className="ticket-info-row">
          <span>Reported On</span>

          <strong>
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "N/A"}
          </strong>
        </div>
      </section>

      {/* Issue Image */}
      <section className="details-card">
        <h2>Issue Image</h2>

        {ticket.imageUrl ? (
          <img
            src={ticket.imageUrl}
            alt={ticket.title}
            className="ticket-image"
          />
        ) : (
          <p className="not-assigned">
            No image attached to this ticket.
          </p>
        )}

        {/* Update Image */}
        {ticket.status === "OPEN" && !fromAdmin && (
          <div className="image-update-section">

            <label
              htmlFor="update-ticket-image"
              className="image-update-label"
            >
              {ticket.imageUrl
                ? "Change Issue Image"
                : "Add Issue Image"}
            </label>

            <input
              id="update-ticket-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Preview */}
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
              <p className="image-success-message">
                {imageMessage}
              </p>
            )}

            {/* Error */}
            {imageError && (
              <p className="image-error-message">
                {imageError}
              </p>
            )}

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
      </section>

    </div>

    {/* RIGHT SECTION */}
    <aside className="ticket-sidebar">

      <div className="details-card">
        <h2>Ticket Information</h2>

        <div className="details-list">

          <div className="detail-row">
            <span>Department</span>
            <strong>
              {ticket.departmentId?.name || "Not assigned"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Category</span>
            <strong>{ticket.category || "N/A"}</strong>
          </div>

          <div className="detail-row">
            <span>Location</span>
            <strong>{ticket.location || "N/A"}</strong>
          </div>

          <div className="detail-row">
            <span>Priority</span>
            <strong>{ticket.priority || "N/A"}</strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <strong>
              {(ticket.status || "N/A").replace("_", " ")}
            </strong>
          </div>

          <div className="detail-row">
            <span>Safety Flag</span>
            <strong>
              {ticket.safetyFlag ? "Yes ⚠" : "No"}
            </strong>
          </div>

        </div>
      </div>

    </aside>

  </div>

  {/* DESCRIPTION */}
  <section className="ticket-description-card">
    <h2>Description</h2>

    <p>
      {ticket.description || "No description available."}
    </p>
  </section>

  {/* STATUS WORKFLOW
  <div className="ticket-workflow">
    <TicketStatusWorkflow
      ticketId={ticketId}
      status={status}
      setStatus={setStatus}
    />
  </div> */}

</div>

);
}

export default TicketDetails;
