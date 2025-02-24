import React from "react";
import DepartmentPlace from "./DepartmentPlace";

const DepartmentLeaderboard = ({ data }) => {
  return (
    <div
      className="lead-place-container"
      style={{ height: "285px" }}
    >
      <DepartmentPlace
        rank={1}
        nickname={data[0].nickname}
        similarity={data[0].similarity}
        color={"#575E2B"}
      />
      <DepartmentPlace
        rank={2}
        nickname={data[1].nickname}
        similarity={data[1].similarity}
        color={"#626D32"}
      />
      <DepartmentPlace
        rank={3}
        nickname={data[2].nickname}
        similarity={data[2].similarity}
        color={"#798645"}
      />
      <DepartmentPlace
        rank={4}
        nickname={data[3].nickname}
        similarity={data[3].similarity}
        color={"#798645"}
      />
      <DepartmentPlace
        rank={5}
        nickname={data[4].nickname}
        similarity={data[4].similarity}
        color={"#798645"}
      />
    </div>
  );
};

export default DepartmentLeaderboard;
