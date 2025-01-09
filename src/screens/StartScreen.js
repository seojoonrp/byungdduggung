import React from "react";
import { useNavigate } from "react-router-dom";

function StartScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>~~~ 병뚜껑 게임 ~~~</h1>
      <button onClick={() => navigate('/divide')}>시작하기</button>
    </div>
  );
}

export default StartScreen;