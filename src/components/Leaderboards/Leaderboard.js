import React, { useEffect, useState } from "react";
import TotalLeaderboard from "./TotalLeaderboard";
import DepartmentLeaderboard from "./DepartmentLeaderboard";
import departments from "../../data/Departments";
import { scoreApi } from "../../api.js"; 

const Leaderboard = ({ isOpen, onClose, initialDepartment }) => {
  const [activeTab, setActiveTab] = useState("Total");
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState(initialDepartment);
  const [placeholder, setPlaceholder] = useState("재학 중인 학과를 검색해보세요");
  const [inputValue, setInputValue] = useState(initialDepartment);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ Fetch leaderboard data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await scoreApi.getAllScores(); // 🔹 Correct async fetching
        const sortedData = [...fetchedData].sort((a, b) => b.similarity - a.similarity);
        setData(sortedData);
      } catch (error) {
        console.error("❌ Failed to fetch scores:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array → runs once on mount

  // ✅ Update input value when department changes
  useEffect(() => {
    setInputValue(department);
  }, [department]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = departments.filter((dept) => dept.includes(value)).sort().slice(0, 7);
    setFilteredDepartments(filtered);
    setIsDropdownOpen(filtered.length > 0);
  };

  const handleSelectedDepartment = (dept) => {
    setDepartment(dept);
    setInputValue(dept);
    setIsDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="lead-background" onClick={(e) => e.stopPropagation()}>
        <span className="lead-leaderboard-text">리더보드</span>
        <div className="lead-tab-container">
          <button className={`lead-tab-${activeTab === "Total" ? "on" : "off"}`} onClick={() => setActiveTab("Total")}>
            전체 리더보드
          </button>
          <button className={`lead-tab-${activeTab === "Department" ? "on" : "off"}`} onClick={() => setActiveTab("Department")}>
            학과 리더보드
          </button>
        </div>
        {activeTab === "Total" ? (
          <TotalLeaderboard data={data} />
        ) : (
          <>
            <input
              type="text"
              className="nickname-input"
              style={{ marginTop: 10, marginBottom: 0 }}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={(e) => {
                setPlaceholder("");
                handleInputChange(e);
              }}
              onBlur={(e) => {
                setTimeout(() => setIsDropdownOpen(false), 100);
                setPlaceholder("재학 중인 학과를 검색해보세요");
              }}
            />
            {isDropdownOpen && (
              <ul className="start-dropdown-list" style={{ top: `calc(50% - 87px)` }}>
                {filteredDepartments.map((dept, index) => (
                  <li key={index} className="start-dropdown-item" onClick={() => handleSelectedDepartment(dept)}>
                    {dept}
                  </li>
                ))}
              </ul>
            )}
            <DepartmentLeaderboard data={data} department={department} />
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
