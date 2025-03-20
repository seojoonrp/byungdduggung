import React from "react";
import CryptoJS from 'crypto-js';
import TotalPlace from "./TotalPlace";

const TotalLeaderboard = ({ data }) => {
  const JUJIMAE = 'c69d6e5dfac54cf4a7cb8f912b71a6eb5df8c8a7c9f28f3a88939f6f1a7d1c9d';

  return (
    <div className="lead-place-container">
      {data.slice(0, 5).map((item, index) => (
        <TotalPlace
          key={index}
          rank={index + 1}
          nickname={item.nickname}
          department={item.department}
          similarity={CryptoJS.AES.decrypt(item.similarity, JUJIMAE).toString(CryptoJS.enc.Utf8)}
          color={index === 0 ? "#575E2B" : index === 1 ? "#626D32" : "#798645"}
        />
      ))}
    </div>
  );
};

export default TotalLeaderboard;
