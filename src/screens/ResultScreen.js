import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Score from "../components/Score";
import HowCalculated from "../components/HowCalculated";

function ResultScreen({ department }) {
  const navigate = useNavigate();
  const [similarity, setSimilarity] = useState(0);

  const [isHowCalculatedOpen, setIsHowCalculatedOpen] = useState(false);
  const openHowCalculated = () => setIsHowCalculatedOpen(true);
  const closeHowCalculated = () => setIsHowCalculatedOpen(false);

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
      <button
        className="result-how-calculated"
        onClick={openHowCalculated}>
        유사도는 어떻게 측정되나요?
      </button>

      <span>{department}</span>

      <HowCalculated
        isOpen={isHowCalculatedOpen}
        onClose={closeHowCalculated}
      />
    </div>
  );
}

export default ResultScreen;
