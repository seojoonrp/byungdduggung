import React from "react";

const Description = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="desc" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

export default Description;