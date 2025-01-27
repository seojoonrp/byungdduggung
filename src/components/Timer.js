import React, { useState, useEffect } from "react";

import "../styles/styles.css";

function Timer({ duration, onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 100;
    const totalSteps = duration * 1000 / interval;
    let curStep = 0;

    const timer = setInterval(() => {
      curStep++;
      setProgress((curStep / totalSteps) * 100);

      if (curStep >= totalSteps) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="timer-bar">
      <div
        className="timer-bar-fill"
        style={{ width: `${100 - progress}%` }}
      />
    </div>
  )
}

export default Timer;