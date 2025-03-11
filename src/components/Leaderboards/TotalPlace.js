import React from "react";

const TotalPlace = ({ rank, nickname, department, similarity, color }) => {
  return (
    <div
      className="lead-place-box"
      style={{ borderColor: color }}
    >
      <span
        className="lead-place-text-rank"
        style={{ color: color }}
      >
        #{rank}.
      </span>
      <div className="lead-place-nickname-container">
        <span
          className="lead-place-text-nickname"
          style={{ marginLeft: 0 }}
        >
          {nickname}
        </span>
        <span className="lead-place-text-department">{department}</span>
      </div>
      <span
        className="lead-place-text-similarity"
        style={{ color: color }}
      >
        {similarity}%
      </span>
    </div>
  );
}

export default TotalPlace;