import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/styles.css";

import Description from "../components/Description";
import departments from "../data/Departments";

import TitleImage from "../images/StartScreen/TitleImage.svg";
import MainLogoImage from "../images/StartScreen/MainLogoImage.svg";
import Leaderboard from "../components/Leaderboards/Leaderboard";

function StartScreen({ department, setDepartment }) {
  const navigate = useNavigate();

  const [placeholder, setPlaceholder] = useState("재학 중인 학과를 검색해보세요");

  const [inputValue, setInputValue] = useState(department);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const openDescription = () => setIsDescriptionOpen(true);
  const closeDescription = () => setIsDescriptionOpen(false);

  // ✅ Added reOpen state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [reOpen, setReOpen] = useState(false); // ✅ Ensure leaderboard fetches fresh data

  // ✅ Open leaderboard & trigger refresh
  const openLeaderboard = () => {
    setIsLeaderboardOpen(true);
    setReOpen(true); // ✅ Trigger leaderboard refresh
  };
  const closeLeaderboard = () => setIsLeaderboardOpen(false);

  const handleStartGame = () => {
    if (!department) {
      alert("학과를 선택해주세요!");
      return;
    }

    navigate("/game");
  };

  return (
    <div className="main-container">
      <img src={TitleImage} alt="제목 이미지" className="start-title" />
      <img src={MainLogoImage} alt="메인 로고 이미지" className="start-logo" />

      <>
        <input
          type="text"
          className="nickname-input"
          style={{ marginTop: 25, marginBottom: 25 }}
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
          <ul className="start-dropdown-list">
            {filteredDepartments.map((dept, index) => (
              <li key={index} className="start-dropdown-item" onClick={() => handleSelectedDepartment(dept)}>
                {dept}
              </li>
            ))}
          </ul>
        )}
      </>

      <button className="main-button lightgreen" onClick={openDescription}>
        게임 설명
      </button>
      <button className="main-button lightgreen" onClick={openLeaderboard}>
        리더보드 보기
      </button>
      <button className="main-button darkgreen" onClick={handleStartGame}>
        시작하기!
      </button>

      <Description isOpen={isDescriptionOpen} onClose={closeDescription} />
      <Leaderboard isOpen={isLeaderboardOpen} onClose={closeLeaderboard} reOpen={reOpen} setReOpen={setReOpen} />
    </div>
  );
}

export default StartScreen;
