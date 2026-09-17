import { useEffect } from "react";
import { FiX } from "react-icons/fi";

import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="rx-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="rx-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="rx-modal-header">
          <h2 id="modal-title">
            {title}
          </h2>

          <button
            type="button"
            className="rx-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <div className="rx-modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;