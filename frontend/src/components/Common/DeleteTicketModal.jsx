import "./DeleteTicketModal.css";

const DeleteTicketModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  ticketTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-icon">
          🗑️
        </div>

        <h2>Delete Ticket?</h2>

        <p>
          Are you sure you want to delete
          <strong> "{ticketTitle}"</strong>?
        </p>

        <p className="delete-warning">
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button
            className="modal-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="modal-delete-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTicketModal;