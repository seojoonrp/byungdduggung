import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Score from "../components/Score";

function ResultScreen({ department }) {
  const navigate = useNavigate();
  const [similarity, setSimilarity] = useState(0);

  // Score 컴포넌트로부터 similarity를 전달받아 state에 저장
  const handleSimilarityChange = (val) => {
    setSimilarity(val);
  };

  return (
    <div className="main-container">
      <Score onSimilarityChange={handleSimilarityChange} />
      <button
        className="main-button lightgreen"
      >
        다시하기
      </button>
      <button
        className="main-button lightgreen"
      >
        리더보드 보기
      </button>
      <button
        className="main-button darkgreen"
      >
        스토리 공유하기!
      </button>
    </div>
  );
}

export default ResultScreen;
