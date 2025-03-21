import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import { scoreApi } from "../api.js";
import Score from "../components/Score";

const Nickname = ({ department, setReOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [nickname, setNickname] = useState("");
  const [similarity, setSimilarity] = useState(0);

  const JUJIMAE = 'c69d6e5dfac54cf4a7cb8f912b71a6eb5df8c8a7c9f28f3a88939f6f1a7d1c9d';

  const handleSimilarityChange = (val) => {
    setSimilarity(val);
  };

  const handleConfirm = async () => {
    if (nickname.length < 1 || nickname.length > 8) {
      alert("닉네임은 1~8글자로 입력해주세요.");
      return;
    }

    try {
      const encryptedSimilarity = CryptoJS.AES.encrypt(similarity.toFixed(2).toString(), JUJIMAE).toString();

      await scoreApi.submitScore(nickname, department, Number(similarity).toFixed(2));
      alert("리더보드에 점수가 등록되었습니다!");

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
        <span
          className="how-calc-text"
          style={{ marginBottom: 20, marginTop: -5, fontSize: 10, letterSpacing: -0.1 }}
        >
          * 첫 저장 시 서버를 불러오느라 시간이 오래 걸릴 수 있습니다. *<br />
          조금만 기다려주세요. (30초 ~ 1분)
        </span>
      </div>
    </div>
  );
};

export default Nickname;
