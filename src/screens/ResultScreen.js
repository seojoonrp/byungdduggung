import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Score from "../components/score";

function ResultScreen({ department }) {
  const navigate = useNavigate();
  const [similarity, setSimilarity] = useState(0);

  // Score 컴포넌트로부터 similarity를 전달받아 state에 저장
  const handleSimilarityChange = (val) => {
    setSimilarity(val);
  };

  return (
    <div className="result-container">
      {/* Score 컴포넌트에서 계산된 유사도 값을 여기서만 표시 */}
      <h1 className="result-similarity">유사도 : {similarity.toFixed(4)}</h1>

      {/* Score 컴포넌트 (DTW 계산) */}
      <Score onSimilarityChange={handleSimilarityChange} />

      <h1 className="result-similarity">학과 : {department}</h1>
      {/* 필요하다면 navigate(...) 등 다른 로직 추가 */}
    </div>
  );
}

export default ResultScreen;
