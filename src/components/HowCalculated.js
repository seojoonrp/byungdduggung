import React from "react";

const HowCalculated = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="desc-overlay" onClick={onClose}>
      <div className="desc" onClick={(e) => e.stopPropagation()}>
        <button className="desc-close-button" onClick={onClose}>
          ✕
        </button>
        <span>유사도는 주지매의 개쩌는 알고리즘으로 측정됩니다</span>
      </div>
    </div>
  );
};

export default HowCalculated;