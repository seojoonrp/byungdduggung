import React from "react";
import DepartmentPlace from "./DepartmentPlace";

const DepartmentLeaderboard = ({ data, department }) => {
  const filterByDepartment = (data, department) => {
    return data.filter(item => item.department === department);
  };

  const filteredData = filterByDepartment(data, department);

  return (
    <div
      className="lead-place-container department"
      style={{ height: "283px" }}
    >
      {filteredData.map((item, index) => (
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
