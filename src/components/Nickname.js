import React, { useState } from "react";
import { scoreApi } from "../api.js"; // Ensure correct import path
import Score from "../components/Score"; // Import Score.js

const Nickname = ({ department, onNicknameChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [nickname, setNickname] = useState("");
  const [similarity, setSimilarity] = useState(0); // Store similarity from Score.js

  // Function to receive similarity from Score.js
  const handleSimilarityChange = (val) => {
   // console.log("✅ Similarity received in Nickname:", val); // Debug log
    setSimilarity(val);
  };

  const handleConfirm = async () => {  
    if (nickname.length < 1 || nickname.length > 10) {
      alert("닉네임은 1~10글자로 입력해주세요.");
      return;
    }
  
    //console.log("🚀 Sending Data:", { nickname, department, similarity });
    similarity = Number(similarity.toFixed(2));
    try {
      const response = await scoreApi.submitScore(nickname, department, similarity);
      alert("서버에 점수가 등록되었습니다!");
    } catch (error) {
      console.error("❌ 점수 등록 오류:", error);
      alert("점수 등록에 실패했습니다. 다시 시도해주세요.");
    }

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1 }}>
      <div className="nickname-container">
        <span className="nickname-text bold" style={{ marginTop: 10 }}>
          리더보드에 남길 닉네임을 입력해주세요.
        </span>

        {/* ✅ Include Score component to receive similarity */}
        <Score onSimilarityChange={handleSimilarityChange} />

        <input
          className="nickname-input"
          placeholder="1~10글자로 입력해주세요."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button
          className="main-button lightgreen"
          style={{ marginBottom: 20 }}
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Nickname;
