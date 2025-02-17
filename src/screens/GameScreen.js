import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/styles.css";

import Timer from "../components/Timer";
import Countdown from "../components/Countdown";
import GamePanel from "../components/GamePanel";

function GameScreen() {
  const navigate = useNavigate();

  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const handleCountdownComplete = () => {
    setIsCountdownComplete(true);
  }

  return (
    <div className="main-container">
      <Timer
        duration={60}
        onComplete={() => navigate('/result')}
        isActive={isCountdownComplete}
      />
      <GamePanel isActive={isCountdownComplete} />
      {!isCountdownComplete && <Countdown onComplete={handleCountdownComplete} />}
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