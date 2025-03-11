import React from "react";

const DepartmentPlace = ({ rank, nickname, similarity, color }) => {
  return (
    <div
      className="lead-place-box"
      style={{ borderColor: color, height: "48px" }}
    >
      <span
        className="lead-place-text-rank"
        style={{ color: color }}
      >
        #{rank}.
      </span>
      <span
        className="lead-place-text-nickname"
      >
        {nickname}
      </span>
      <span
        className="lead-place-text-similarity"
        style={{ color: color }}
      >
        {similarity}%
      </span>
    </div>
  );
}

export default DepartmentPlace;