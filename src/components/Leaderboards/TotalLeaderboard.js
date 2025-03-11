import React from "react";
import TotalPlace from "./TotalPlace";

const TotalLeaderboard = ({ data }) => {
  return (
    <div className="lead-place-container">
      {data.slice(0, 5).map((item, index) => (
        <TotalPlace
          key={index}
          rank={index + 1}
          nickname={item.nickname}
          department={item.department}
          similarity={item.similarity}
          color={index === 0 ? "#575E2B" : index === 1 ? "#626D32" : "#798645"}
        />
      ))}
    </div>
  );
};

export default TotalLeaderboard;
