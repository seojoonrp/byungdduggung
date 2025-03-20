import React, { useEffect, useState } from "react";
import TotalLeaderboard from "./TotalLeaderboard";
import DepartmentLeaderboard from "./DepartmentLeaderboard";
import departments from "../../data/Departments";
import { scoreApi } from "../../api.js";

const Leaderboard = ({ isOpen, onClose, initialDepartment, reOpen, setReOpen }) => {
  const [activeTab, setActiveTab] = useState("Total");
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState(initialDepartment);
  const [placeholder, setPlaceholder] = useState("재학 중인 학과를 검색해보세요");
  const [inputValue, setInputValue] = useState(initialDepartment);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !firstOpen) {
      fetchTotalData();
      setFirstOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (reOpen) {
      fetchTotalData();
      setReOpen(false);
    }
  }, [reOpen]);

  const fetchTotalData = async () => {
    try {
      const fetchedData = await scoreApi.getAllScores();
      setData(fetchedData);
    } catch (error) {
      console.error("전체 점수 조회 실패: ", error);
    }
  };

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
            <div style={{ position: "relative", width: 180, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <input
                type="text"
                className="nickname-input"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={(e) => {
                  setPlaceholder("");
                  handleInputChange(e);
                }}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                style={{ width: "100%", zIndex: 10, marginTop: 10, marginBottom: -2 }}
              />
              {isDropdownOpen && (
                <ul
                  className="start-dropdown-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    transform: `translateY(4px)`,
                    left: "0",
                    width: 180,
                    background: "transparent",
                    zIndex: 20,
                    padding: 0,
                  }}
                >
                  {filteredDepartments.map((dept, index) => (
                    <li
                      key={index}
                      className="start-dropdown-item"
                      onClick={() => handleSelectedDepartment(dept)}
                      style={{
                        padding: "4px 12px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      {dept}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <DepartmentLeaderboard department={department} />
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
