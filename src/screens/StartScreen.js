import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/styles.css";

import Description from "../components/Description";
import departments from "../components/Departments";

import TitleImage from "../images/StartScreen/TitleImage.svg";
import MainLogoImage from "../images/StartScreen/MainLogoImage.svg";

function StartScreen({ department, setDepartment }) {
  const navigate = useNavigate();

  const [placeholder, setPlaceholder] = useState("재학 중인 학과를 입력해주세요");

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const openDescription = () => setIsDescriptionOpen(true);
  const closeDescription = () => setIsDescriptionOpen(false);

  return (
    <div className="main-container">
      <img
        src={TitleImage}
        alt="제목 이미지"
        className="start-title"
      />
      <img
        src={MainLogoImage}
        alt="메인 로고 이미지"
        className="start-logo"
      />
      <select
        className="start-department-dropdown"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="" disabled>학과를 선택하세요</option>
        {departments.map((dept, index) => (
          <option key={index} value={dept}>{dept}</option>
        ))}
      </select>
      <button
        className="main-button lightgreen"
        onClick={openDescription}
      >
        게임 설명
      </button>
      <button
        className="main-button lightgreen"
      >
        리더보드 보기
      </button>
      <button
        className="main-button darkgreen"
        onClick={() => navigate('/game')}
      >
        시작하기!
      </button>

      <Description
        isOpen={isDescriptionOpen}
        onClose={closeDescription}
      />
    </div>
  );
}

export default StartScreen;