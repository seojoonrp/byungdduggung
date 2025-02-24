import React, { useEffect, useState } from "react";

import TotalLeaderboard from "./TotalLeaderboard";
import DepartmentLeaderboard from "./DepartmentLeaderboard";

import similarityData from "../../data/similarityData";

const Leaderboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Total");

  const [data, setData] = useState([]);
  useEffect(() => {
    const sortedData = [...similarityData].sort((a, b) => b.similarity - a.similarity);
    setData(sortedData);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="lead-background" onClick={(e) => e.stopPropagation()}>
        <span className="lead-leaderboard-text">리더보드</span>
        <div className="lead-tab-container">
          <button
            className={`lead-tab-${activeTab === "Total" ? "on" : "off"}`}
            onClick={() => setActiveTab("Total")}
          >
            전체 리더보드
          </button>
          <button
            className={`lead-tab-${activeTab === "Department" ? "on" : "off"}`}
            onClick={() => setActiveTab("Department")}
          >
            학과 리더보드
          </button>
        </div>
        {
          activeTab === "Total" ?
            <TotalLeaderboard
              data={data}
            >
            </TotalLeaderboard> :
            <DepartmentLeaderboard>
            </DepartmentLeaderboard>
        }
      </div>
    </div>
  );
};

export default Leaderboard;