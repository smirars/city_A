import React from "react";
import "../styles/SuccessModal.css";

const SuccessModal = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__window" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>×</button>
        <div className="modal__content">{message}</div>
      </div>
    </div>
  );
};

export default SuccessModal;
