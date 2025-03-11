import React, { useState, useEffect } from "react";

const Nickname = ({ department, onNicknameChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [nickname, setNickname] = useState("");

  const handleConfirm = () => {
    if (nickname.length < 1 || nickname.length > 10) {
      alert("닉네임은 1~10글자로 입력해주세요.")
      return;
    }
    
    // 닉네임이 확정되면 부모 컴포넌트에 전달
    if (onNicknameChange) {
      onNicknameChange(nickname);
    }
    
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1 }}>
      <div className="nickname-container">
        <span className="nickname-text" style={{ marginTop: 19 }}>축하드립니다!</span>
        <span className="nickname-text">{department} 유저들의 유사도 중 5등 내에 드셨습니다.</span>
        <span className="nickname-text bold" style={{ marginTop: 10 }}>리더보드에 남길 닉네임을 입력해주세요.</span>
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