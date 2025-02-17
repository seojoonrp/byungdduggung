import React from "react";

const HowCalculated = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="how-calc" onClick={(e) => e.stopPropagation()}>
        {/* <button className="modal-close-button" onClick={onClose}>
          ✕
        </button> */}
      </div>
    </div>
  );
};

export default HowCalculated;