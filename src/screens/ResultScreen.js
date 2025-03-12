import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Score from "../components/Score";
import HowCalculated from "../components/HowCalculated";
import Nickname from "../components/Nickname";
import Leaderboard from "../components/Leaderboards/Leaderboard";
import html2canvas from "html2canvas"; // (이미 캡처 기능을 안 쓰면 제거 가능)

function ResultScreen({ department }) {
  const navigate = useNavigate();
  const [similarity, setSimilarity] = useState(0);
  const [isHowCalculatedOpen, setIsHowCalculatedOpen] = useState(false);

  const openHowCalculated = () => setIsHowCalculatedOpen(true);
  const closeHowCalculated = () => setIsHowCalculatedOpen(false);

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const openLeaderboard = () => setIsLeaderboardOpen(true);
  const closeLeaderboard = () => setIsLeaderboardOpen(false);

  const handleRestart = () => {
    navigate("/game");
  };

  // Score 컴포넌트로부터 similarity 전달
  const handleSimilarityChange = (val) => {
    setSimilarity(val);
  };

  // 스토리 공유 버튼: URL 복사 → 인스타그램 앱 열기
  const handleShare = async () => {
    try {
      // 해시(#) 제거된 URL
      const baseUrl = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(window.location.origin);
      alert("링크가 클립보드에 복사되었습니다!");
      window.location.href = "instagram://app";
      window.open("https://www.instagram.com/", "_blank");
    } catch (error) {
      console.error("공유 실패:", error);
      alert("공유에 실패했습니다.");
    }
  };

  return (
    <div className="main-container">
      <Nickname department={department} />
      <Score onSimilarityChange={handleSimilarityChange} />
      <button className="main-button lightgreen" onClick={handleRestart}>
        다시하기
      </button>
      <button className="main-button lightgreen" onClick={openLeaderboard}>리더보드 보기</button>
      <button className="main-button darkgreen" onClick={handleShare}>
        스토리 공유하기!
      </button>
      <button className="result-how-calculated" onClick={openHowCalculated}>
        유사도는 어떻게 측정되나요?
      </button>
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={closeLeaderboard}
        initialDepartment={department}
      />
      <HowCalculated isOpen={isHowCalculatedOpen} onClose={closeHowCalculated} />
    </div>
  );
}

export default ResultScreen;
