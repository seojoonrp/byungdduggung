import React, { useState } from "react";
import { scoreApi } from "../api.js"; // Ensure correct import path
import Score from "../components/Score"; // Import Score.js

const Nickname = ({ department, setReOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [nickname, setNickname] = useState("");
  const [similarity, setSimilarity] = useState(0); // Store similarity from Score.js

  // Function to receive similarity from Score.js
  const handleSimilarityChange = (val) => {
    console.log("✅ Similarity received in Nickname:", val); // Debug log
    setSimilarity(val);
  };

  const handleConfirm = async () => {
    if (nickname.length < 1 || nickname.length > 8) {
      alert("닉네임은 1~8글자로 입력해주세요.");
      return;
    }

    console.log("🚀 Sending Data:", { nickname, department, similarity });

    try {
      await scoreApi.submitScore(nickname, department, Number(similarity.toFixed(2))); // 점수 저장
      alert("리더보드에 점수가 등록되었습니다!");

      // ✅ 닉네임 제출 후 ReOpen 상태를 true로 변경
      setReOpen(true);
    } catch (error) {
      alert("점수 등록에 실패했습니다. 다시 시도해주세요.");
    }

    setIsOpen(false);
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1 }}>
      <div className="nickname-container">
        <span className="nickname-text bold" style={{ marginTop: 20 }}>
          리더보드에 남길 닉네임을 입력해주세요.
        </span>

        {/* ✅ Score 컴포넌트 추가 (onSimilarityChange로 점수 전달받음) */}
        <Score onSimilarityChange={handleSimilarityChange} isShown={false} />

        <input
          className="nickname-input"
          placeholder="1~8글자로 입력해주세요."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button
          className="main-button lightgreen"
          style={{ marginBottom: 5 }}
          onClick={handleConfirm}
        >
          확인
        </button>
        <button
          className="main-button darkgreen"
          style={{ marginBottom: 20 }}
          onClick={handleSkip}
        >
          저장 없이 넘어가기
        </button>
      </div>
    </div>
  );
};

export default Nickname;
