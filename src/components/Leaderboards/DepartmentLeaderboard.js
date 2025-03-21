import React, { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';
import DepartmentPlace from "./DepartmentPlace";
import { scoreApi } from "../../api.js";

const DepartmentLeaderboard = ({ department }) => {
  const [departmentData, setDepartmentData] = useState([]);

  const JUJIMAE = 'c69d6e5dfac54cf4a7cb8f912b71a6eb5df8c8a7c9f28f3a88939f6f1a7d1c9d';

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
  }, [department]);

  return (
    <div className="lead-place-container department" style={{ height: "283px" }}>
      {departmentData.map((item, index) => (
        <DepartmentPlace
          key={index}
          rank={index + 1}
          nickname={item.nickname}
          // similarity={Number(CryptoJS.AES.decrypt(item.similarity, JUJIMAE).toString(CryptoJS.enc.Utf8))}
          similarity={item.similarity}
          color={index === 0 ? "#575E2B" : index === 1 ? "#626D32" : "#798645"}
        />
      ))}
    </div>
  );
};

export default DepartmentLeaderboard;
