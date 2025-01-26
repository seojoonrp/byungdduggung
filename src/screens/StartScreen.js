import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './StartScreen.css';

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
        className="start-sojuImg"
      />
      <input
        type="text"
        className="start-departmentInput"
        placeholder={placeholder}
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("재학 중인 학과를 입력해주세요")}
      />
      <button
        className="start-infoButton"
      >
        게임 설명
      </button>
      <button
        className="start-leaderBoardButton"
      >
        리더보드 보기
      </button>
      <button
        className="start-startButton"
        onClick={() => navigate('/game')}
      >
        시작하기
      </button>
    </div>
  );
}

export default StartScreen;