import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/styles.css';

import TitleImage from '../images/StartScreen/TitleImage.svg';
import MainLogoImage from '../images/StartScreen/MainLogoImage.svg';

function StartScreen({ department, setDepartment }) {
  const navigate = useNavigate();

  const [placeholder, setPlaceholder] = useState("재학 중인 학과를 입력해주세요");

  return (
    <div className="start-container">
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
      <input
        type="text"
        className="start-department-input"
        placeholder={placeholder}
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("재학 중인 학과를 입력해주세요")}
      />
      <button
        className="main-button lightgreen-button"
      >
        게임 설명
      </button>
      <button
        className="main-button lightgreen-button"
      >
        리더보드 보기
      </button>
      <button
        className="main-button darkgreen-button"
        onClick={() => navigate('/game')}
      >
        시작하기
      </button>
    </div>
  );
}

export default StartScreen;