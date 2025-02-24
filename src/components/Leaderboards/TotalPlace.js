import React from "react";

const TotalPlace = ({ rank, nickname, department, similarity, color }) => {
  return (
    <div
      className="lead-total-place-container"
      style={{ borderColor: color }}
    >
      <span>#{rank}. {nickname} {similarity}%</span>
    </div>
  );
}

export default TotalPlace;