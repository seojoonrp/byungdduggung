import React from "react";
import { useNavigate } from "react-router-dom";

function MakeScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>샤 만들기 화면</h1>
      <button onClick={() => navigate('/result')}>유사도 확인하기</button>
    </div>
  );
}

export default MakeScreen;