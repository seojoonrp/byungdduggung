import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './StartScreen.css';

import BackgroundImage from '../images/BackgroundImage.svg';

function StartScreen({ department, setDepartment }) {
  const navigate = useNavigate();

  const [placeholder, setPlaceholder] = useState("재학 중인 학과를 입력해주세요");

  return (
    <div className="start-container">
      <h1 className="start-title">~~~ 병뚜껑 게임 ~~~</h1>
      <img
        src="https://www.ceoscoredaily.com/photos/2021/03/11/2021031112333638672_l.png"
        alt="병뚜껑 게임 이미지"
        className="start-sojuImg"
      />
      <button
        className="start-infoButton"
      >
        게임 설명 보기
      </button>
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
        className="start-startButton"
        onClick={() => navigate('/divide')}
      >
        시작하기
      </button>
    </div>
  );
}

export default StartScreen;