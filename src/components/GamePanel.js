import React, { useEffect, useState } from "react";

import "./GamePanel.css";

import PanelBorderImage from "../images/GameScreen/PanelBorderImage.svg";
import BottleCapImage from "../images/GameScreen/BottleCapImage.svg"

const GamePanel = () => {
  const capWidth = 75;
  const totalLength = Math.PI * capWidth;

  const fillSpeed = 0.003;
  const rotationSpeed = 0.3;
  const frameTime = 25;

  const [curRatio, setCurRatio] = useState(0);
  const [segmentRatio, setSegmentRatio] = useState(0);
  const [confirmedRatio, setConfirmedRatio] = useState(0);
  const [curRotation, setCurRotation] = useState(0);
  const [curPivot, setCurPivot] = useState({ x: 200, y: 100 });

  const [isClicked, setIsClicked] = useState(false);

  // 클릭 해제시 막대 채우기
  useEffect(() => {
    if (!isClicked && curRatio < 1) {
      const fillInterval = setInterval(() => {
        setCurRatio((prev) => Math.min(prev + fillSpeed, 1));
      }, frameTime);

      return () => clearInterval(fillInterval);
    }
  }, [isClicked, curRatio]);

  // 클릭시 막대 돌리기
  useEffect(() => {
    if (isClicked) {
      const rotateInterval = setInterval(() => {
        setCurRotation((prev) => prev + rotationSpeed);
      }, frameTime);

      return () => clearInterval(rotateInterval);
    }
  }, [isClicked, curRotation]);

  // 클릭했을 때
  const handleMouseDown = () => {
    setIsClicked(true);

    setSegmentRatio(curRatio - confirmedRatio);
    setConfirmedRatio(curRatio);
  };

  // 클릭 뗐을 때
  const handleMouseUp = () => {
    setIsClicked(false);

    const newPivot = calculateNewPivot(confirmedRatio);
    setCurPivot(newPivot);
  };

  const calculateNewPivot = () => {
    const segmentLength = totalLength * segmentRatio;
    const radRotation = curRotation * Math.PI / 180;

    return {
      x: curPivot.x + segmentLength * Math.sin(radRotation),
      y: curPivot.y - segmentLength * Math.cos(radRotation)
    }
  }

  return (
    <div className="container">
      <img
        src={BottleCapImage}
        alt="병뚜껑 이미지"
        className="bottle-cap-image"
        style={{ width: `${capWidth}px` }}
      />
      <img
        src={PanelBorderImage}
        alt="패널 경계선 이미지"
        className="background-border"
      />
    </div>
  );
};

export default GamePanel;