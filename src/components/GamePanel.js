import React, { useEffect, useState } from "react";

import "./GamePanel.css";

import PanelBorderImage from "../images/GameScreen/PanelBorderImage.svg";
import BottleCapImage from "../images/GameScreen/BottleCapImage.svg"

const GamePanel = () => {
  const capWidth = 75;
  const barWidth = 3;
  const totalLength = Math.PI * capWidth;

  const fillSpeed = 0.003;
  const rotationSpeed = 0.3;
  const frameTime = 25;

  const [curRatio, setCurRatio] = useState(0);
  const [confirmedRatio, setConfirmedRatio] = useState(0);
  const [curRotation, setCurRotation] = useState(-90);
  const [curPivot, setCurPivot] = useState({ x: 105, y: 358 });

  const [segments, setSegments] = useState([]);

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
    const segmentLength = (curRatio - confirmedRatio) * totalLength;
    setSegments((prev) => [...prev, { size: segmentLength, angle: curRotation }]);

    setConfirmedRatio(curRatio);

    console.log(segments);

    setIsClicked(true);
  };

  // 클릭 뗐을 때
  const handleMouseUp = () => {
    const newPivot = calculateNewPivot();
    setCurPivot(newPivot);

    setIsClicked(false);
  };

  const calculateNewPivot = () => {
    const segmentLength = segments[segments.length - 1].size;
    const radRotation = curRotation * Math.PI / 180;

    return {
      x: curPivot.x + segmentLength * Math.sin(radRotation),
      y: curPivot.y + segmentLength * Math.cos(radRotation)
    }
  }

  const renderSegments = () => {
    let x = curPivot.x;
    let y = curPivot.y;

    return segments.map((segment, index) => {
      const radRotation = curRotation * Math.PI / 180;
      const transform = `translate(${x}, ${y}) rotate(${segment.angle})`;

      x += segment.size * Math.cos(radRotation);
      y += segment.size * Math.sin(radRotation);

      return (
        <g key={index} transform={transform}>
          <rect
            x={0}
            y={-barWidth / 2}
            width={segment.size}
            height={barWidth}
            fill="#798645"
          />
        </g>
      );
    });
  };

  return (
    <div
      className="container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
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

      <svg
        width={280}
        height={460}
        style={{
          position: "absolute",
          top: 0,
          left: 0
        }}
      >
        {renderSegments()}
        {!isClicked && (
          <g transform={`translate(${curPivot.x}, ${curPivot.y}) rotate(${curRotation})`}>
            <rect
              x={0}
              y={-barWidth / 2}
              width={(curRatio - confirmedRatio) * totalLength}
              height={barWidth}
              fill="#BAC677"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default GamePanel;