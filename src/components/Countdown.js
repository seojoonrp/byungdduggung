import React, { useState, useEffect } from "react";

import ShaImage from "../images/GameScreen/Sha.svg";

function Countdown({ onComplete }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="countdown-overlay">
      <img
        src={ShaImage}
        alt="샤 이미지"
        style={{ width: "80px" }}
      />
      <span className="countdown-text">위 모양과 최대한 비슷하게 만들어보세요!</span>
      <div className="countdown-number">{count}</div>
    </div>
  );
}

export default Countdown;