import React, { useEffect, useState } from "react";

import "./GamePanel.css";

import PanelBorderImage from "../images/GameScreen/PanelBorderImage.svg";
import BottleCapImage from "../images/GameScreen/BottleCapImage.svg"

const GamePanel = () => {
  const capWidth = 75;
  const barWidth = 2.5;
  const totalLength = Math.PI * capWidth;

  const fillSpeed = 0.0035;
  const rotationSpeed = 2;
  const frameTime = 25;

  const [curRatio, setCurRatio] = useState(0);
  const [confirmedRatio, setConfirmedRatio] = useState(0);
  const [curRotation, setCurRotation] = useState(-90);
  const [curPivot, setCurPivot] = useState({ x: 105, y: 338 });

  const [curSegmentLength, setCurSegmentLength] = useState(0);
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
    setCurSegmentLength((curRatio - confirmedRatio) * totalLength);

    setIsClicked(true);
  };

  // 클릭 뗐을 때
  const handleMouseUp = () => {
    const segmentLength = (curRatio - confirmedRatio) * totalLength;
    setSegments((prev) => [...prev, { size: segmentLength, angle: curRotation }]);

    setConfirmedRatio(curRatio);

    const newPivot = calculateNewPivot(segmentLength);
    setCurPivot(newPivot);

    setIsClicked(false);

    console.log(segments);
  };

  const calculateNewPivot = (segmentLength) => {
    const radRotation = curRotation * Math.PI / 180;

    console.log(segmentLength);

    return {
      x: curPivot.x + segmentLength * Math.cos(radRotation),
      y: curPivot.y + segmentLength * Math.sin(radRotation)
    }
  }

  const renderSegments = () => {
    let x = 105;
    let y = 338;

    return segments.map((segment, index) => {
      const radRotation = segment.angle * Math.PI / 180;
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
        {isClicked && (
          <g transform={`translate(${curPivot.x}, ${curPivot.y}) rotate(${curRotation})`}>
            <rect
              x={0}
              y={-barWidth / 2}
              width={curSegmentLength}
              height={barWidth}
              fill="#798645"
            />
          </g>
        )}
        {!isClicked && (
          <g transform={`translate(${curPivot.x}, ${curPivot.y}) rotate(${curRotation})`}>
            <rect
              x={0}
              y={-barWidth / 2}
              width={(1 - confirmedRatio) * totalLength}
              height={barWidth}
              fill="#BAC677"
            />
            <rect
              x={0}
              y={-barWidth / 2}
              width={(curRatio - confirmedRatio) * totalLength}
              height={barWidth}
              fill="#E81C1C"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default GamePanel;