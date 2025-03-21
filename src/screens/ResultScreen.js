import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Score from "../components/Score";
import HowCalculated from "../components/HowCalculated";
import Nickname from "../components/Nickname";
import Leaderboard from "../components/Leaderboards/Leaderboard";

function ResultScreen({ department }) {
  const navigate = useNavigate();
  const [similarity, setSimilarity] = useState(0);
  const [isHowCalculatedOpen, setIsHowCalculatedOpen] = useState(false);

  const openHowCalculated = () => setIsHowCalculatedOpen(true);
  const closeHowCalculated = () => setIsHowCalculatedOpen(false);

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const [reOpen, setReOpen] = useState(false);

  const openLeaderboard = () => {
    setIsLeaderboardOpen(true);
    setReOpen(true);
  };
  const closeLeaderboard = () => setIsLeaderboardOpen(false);

  const handleRestart = () => {
    navigate("/game");
  };

  const handleSimilarityChange = (val) => {
    setSimilarity(val);
  };

  const handleShare = async () => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(window.location.origin);
      alert("링크가 클립보드에 복사되었습니다.\n결과 화면을 캡쳐해 친구들에게 공유해보세요!");
    } catch (error) {
      console.error("공유 실패:", error);
      alert("공유에 실패했습니다.");
    }
  };

  return (
    <div className="main-container">
      <Nickname department={department} setReOpen={setReOpen} />
      <Score onSimilarityChange={handleSimilarityChange} />
      <button className="main-button lightgreen" onClick={handleRestart}>
        다시하기
      </button>
      <button className="main-button lightgreen" onClick={openLeaderboard}>리더보드 보기</button>
      <button className="main-button darkgreen" onClick={handleShare}>
        공유하기!
      </button>
      <button className="result-how-calculated" onClick={openHowCalculated}>
        유사도는 어떻게 측정되나요?
      </button>
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={closeLeaderboard}
        reOpen={reOpen}
        setReOpen={setReOpen}
      />
      <HowCalculated isOpen={isHowCalculatedOpen} onClose={closeHowCalculated} />
    </div>
  );
}

export default ResultScreen;
