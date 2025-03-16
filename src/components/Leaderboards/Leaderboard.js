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
  const [firstOpen, setFirstOpen] = useState(false); // ✅ 리더보드가 처음 열렸는지 체크

  // ✅ 최초 1회만 fetch 실행 (isOpen이 처음 true가 될 때)
  useEffect(() => {
    if (isOpen && !firstOpen) {
      console.log("📢 리더보드 최초 오픈 - 데이터 가져오기");
      fetchData();
      setFirstOpen(true); // ✅ 한 번 실행 후 다시 실행되지 않도록 설정
    }
  }, [isOpen]);

  // ✅ Nickname 등록 후 (reOpen) 새로고침 트리거
  useEffect(() => {
    if (reOpen) {
      console.log("🔄 Nickname 등록 후 리더보드 업데이트");
      fetchData();
      setReOpen(false); // ✅ 데이터 갱신 후 다시 false로 설정
    }
  }, [reOpen]);

  const fetchData = async () => {
    try {
      const fetchedData = await scoreApi.getAllScores();
      const sortedData = [...fetchedData].sort((a, b) => b.similarity - a.similarity);
      setData(sortedData);
    } catch (error) {
      console.error("❌ Failed to fetch scores:", error);
    }
  };

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

  if (!isOpen) {
    return null;
  }

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