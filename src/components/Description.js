import React from "react";

const Description = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="desc-overlay" onClick={onClose}>
      <div className="desc" onClick={(e) => e.stopPropagation()}>
        <button className="desc-close-button" onClick={onClose}>
          ✕
        </button>
        <span>게임 설명</span>
      </div>
    </div>
  );
};

export default Description;