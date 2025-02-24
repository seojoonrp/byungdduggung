import React from "react";

import TotalPlace from "./TotalPlace";

const TotalLeaderboard = ({ data }) => {
  return (
    <div className="lead-place-container">
      <TotalPlace
        rank={1}
        nickname={data[0].nickname}
        department={data[0].department}
        similarity={data[0].similarity}
        color={"#575E2B"}
      />
      <TotalPlace
        rank={2}
        nickname={data[1].nickname}
        department={data[1].department}
        similarity={data[1].similarity}
        color={"#626D32"}
      />
      <TotalPlace
        rank={3}
        nickname={data[2].nickname}
        department={data[2].department}
        similarity={data[2].similarity}
        color={"#798645"}
      />
      <TotalPlace
        rank={4}
        nickname={data[3].nickname}
        department={data[3].department}
        similarity={data[3].similarity}
        color={"#798645"}
      />
      <TotalPlace
        rank={5}
        nickname={data[4].nickname}
        department={data[4].department}
        similarity={data[4].similarity}
        color={"#798645"}
      />
    </div>
  );
};

export default TotalLeaderboard;
