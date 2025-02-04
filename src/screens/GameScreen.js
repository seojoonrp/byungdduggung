import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/styles.css";

import Timer from "../components/Timer";
import GamePanel from "../components/GamePanel";
import AnswerShapeRenderer from "../components/answer";

function GameScreen() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <Timer
        duration={60}
        onComplete={() => navigate('/result')}
      />
      <GamePanel />
      <AnswerShapeRenderer />
      <button
        className="main-button lightgreen"
        style={{ marginTop: "15px" }}
        onClick={() => navigate('/result')}
      >
        결과 확인하기
      </button>
    </div>
  );
}

export default GameScreen;