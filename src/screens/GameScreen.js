import React from "react";
import { useNavigate } from "react-router-dom";

function GameScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>게임화면</h1>
      <button onClick={() => navigate('/result')}>확인</button>
    </div>
  );
}

export default GameScreen;