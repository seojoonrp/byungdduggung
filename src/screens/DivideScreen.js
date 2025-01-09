import React from "react";
import { useNavigate } from "react-router-dom";

function DivideScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>병뚜껑 나누기 화면</h1>
      <button onClick={() => navigate('/make')}>확인</button>
    </div>
  );
}

export default DivideScreen;