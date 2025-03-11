import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { scoreApi } from "../api";

import Score from "../components/Score";
import HowCalculated from "../components/HowCalculated";
import Nickname from "../components/Nickname";

function ResultScreen({ department }) {
  const navigate = useNavigate();
  const [similarity, setSimilarity] = useState(0);
  const [nickname, setNickname] = useState("");

  const [isHowCalculatedOpen, setIsHowCalculatedOpen] = useState(false);
  const openHowCalculated = () => setIsHowCalculatedOpen(true);
  const closeHowCalculated = () => setIsHowCalculatedOpen(false);

  const submitScore = async () => {
    try {
      if (nickname && similarity > 0) {
        await scoreApi.submitScore(nickname, department, similarity);
        console.log("점수가 성공적으로 제출되었습니다.");
      }
    } catch (error) {
      console.error("점수 제출 실패:", error);
    }
  };

  useEffect(() => {
    if (nickname && similarity > 0) {
      submitScore();
    }
  }, [nickname, similarity]);

  const handleRestart = () => {
    navigate("/game");
  }

  const handleSimilarityChange = (val) => {
    setSimilarity(val);
  };

  const handleNicknameChange = (name) => {
    setNickname(name);
  };

  return (
    <div className="main-container">
      <Nickname 
        department={department} 
        onNicknameChange={handleNicknameChange}
      />

      <Score onSimilarityChange={handleSimilarityChange} />
      <button
        className="main-button lightgreen"
        onClick={handleRestart}
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

      <HowCalculated
        isOpen={isHowCalculatedOpen}
        onClose={closeHowCalculated}
      />
    </div>
  );
}

export default ResultScreen;
