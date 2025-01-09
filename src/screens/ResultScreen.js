import React from "react";
import { useNavigate } from "react-router-dom";

import './ResultScreen.css'

function ResultScreen({ department, similarity }) {
  const navigate = useNavigate();

  return (
    <div className="result-container">
      <h1 className="result-similarity">유사도 : {similarity}</h1>
      <h1 className="result-similarity">학과 : {department}</h1>
    </div>
  );
}

export default ResultScreen;