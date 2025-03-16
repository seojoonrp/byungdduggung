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
      console.log("📢 리더보드 최초 오픈 - 전체 데이터 가져오기");
      fetchTotalData();
      setFirstOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (reOpen) {
      console.log("🔄 Nickname 등록 후 리더보드 업데이트");
      fetchTotalData();
      setReOpen(false);
    }
  }, [reOpen]);

  const fetchTotalData = async () => {
    try {
      const fetchedData = await scoreApi.getAllScores();
      setData(fetchedData);
    } catch (error) {
      console.error("❌ 전체 점수 조회 실패:", error);
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
            {/* ✅ 검색 입력 필드와 드롭다운 리스트를 감싸는 컨테이너 */}
            <div style={{ position: "relative", width: "100%" }}>
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
                style={{ width: "100%", zIndex: 10 }}
              />
              {isDropdownOpen && (
                <ul
                  className="start-dropdown-list"
                  style={{
                    position: "absolute",
                    top: "100%", // ✅ 검색창 바로 아래에 배치
                    left: "0",
                    width: "100%",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 20, // ✅ 드롭다운이 다른 요소 위에 표시됨
                    padding: 0,
                    marginTop: "2px",
                  }}
                >
                  {filteredDepartments.map((dept, index) => (
                    <li
                      key={index}
                      className="start-dropdown-item"
                      onClick={() => handleSelectedDepartment(dept)}
                      style={{
                        padding: "8px 12px",
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
