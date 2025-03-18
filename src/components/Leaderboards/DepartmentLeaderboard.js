import React, { useEffect, useState } from "react";
import DepartmentPlace from "./DepartmentPlace";
import { scoreApi } from "../../api.js";

const DepartmentLeaderboard = ({ department }) => {
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (!department) return;
      try {
        const data = await scoreApi.getDepartmentScores(department);
        setDepartmentData(data);
      } catch (error) {
        console.error("❌ 학과별 점수 불러오기 실패:", error);
      }
    };

    fetchDepartmentData();
  }, [department]); // department 변경 시 새로운 데이터 요청

  return (
    <div className="lead-place-container department" style={{ height: "283px" }}>
      {departmentData.map((item, index) => (
        <DepartmentPlace
          key={index}
          rank={index + 1}
          nickname={item.nickname}
          similarity={item.similarity}
          color={index === 0 ? "#575E2B" : index === 1 ? "#626D32" : "#798645"}
        />
      ))}
    </div>
  );
};

export default DepartmentLeaderboard;
