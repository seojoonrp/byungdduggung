import { useState, useEffect } from "react";
import "../styles/GamePanel.css";

import BottleCapImage from "../images/GameScreen/BottleCapImage.svg";

export let shapeSegmentsGlobal = [];

const GamePanel = ({ isActive }) => {
  const capWidth = 75;
  const barWidth = 2.5;
  const totalLength = Math.PI * capWidth;
  const initialCoordX = 104;
  const initialCoordY = 338;

  const fillSpeed = 0.0035;
  const rotationSpeed = 2;
  const frameTime = 25;

  const [curRatio, setCurRatio] = useState(0);
  const [confirmedRatio, setConfirmedRatio] = useState(0);

  const [curRotation, setCurRotation] = useState(-90);

  const [renderSegments, setRenderSegments] = useState([]);
  const [shapeSegments, setShapeSegments] = useState([]);

  const [prevAngle, setPrevAngle] = useState(-90);

  const [curPivot, setCurPivot] = useState({ x: initialCoordX, y: initialCoordY });

  const [isClicked, setIsClicked] = useState(false);

  const [curSegmentLength, setCurSegmentLength] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (isActive && !gameOver && !isClicked && curRatio < 1) {
      const fillInterval = setInterval(() => {
        setCurRatio((prev) => Math.min(prev + fillSpeed, 1));
      }, frameTime);

      return () => clearInterval(fillInterval);
    }
  }, [isActive, gameOver, isClicked, curRatio]);

  useEffect(() => {
    if (isActive && !gameOver && isClicked) {
      const rotateInterval = setInterval(() => {
        setCurRotation((prev) => prev + rotationSpeed);
      }, frameTime);

      return () => clearInterval(rotateInterval);
    }
  }, [isActive, gameOver, isClicked]);

  const handleMouseDown = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isActive || gameOver) return;

    const segRatio = curRatio - confirmedRatio;
    const segSize = segRatio * totalLength;
    setCurSegmentLength(segSize);

    setIsClicked(true);
  };

  const handleMouseUp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isActive || gameOver) return;

    const segRatio = curRatio - confirmedRatio;
    const segSize = segRatio * totalLength;

    const newAngle = curRotation;
    const deltaAngle = newAngle - prevAngle;

    setRenderSegments((prev) => [
      ...prev,
      { size: segSize, angle: newAngle },
    ]);

    setShapeSegments((prev) => {
      const updated = [...prev, { ratio: segRatio, deltaAngle }];
      shapeSegmentsGlobal = updated;
      return updated;
    });

    setPrevAngle(newAngle);
    setConfirmedRatio(curRatio);

    const newPivot = calculateNewPivot(segSize, newAngle);
    setCurPivot(newPivot);

    setIsClicked(false);

    if (curRatio >= 1) {
      setCurRatio(1);
      setGameOver(true);
    }
  };

  const calculateNewPivot = (segmentSize, absoluteAngle) => {
    const radRotation = (absoluteAngle * Math.PI) / 180;
    return {
      x: curPivot.x + segmentSize * Math.cos(radRotation),
      y: curPivot.y + segmentSize * Math.sin(radRotation),
    };
  };

  const renderConfirmedSegments = () => {
    let x = initialCoordX;
    let y = initialCoordY;

    return renderSegments.map((seg, idx) => {
      const rad = (seg.angle * Math.PI) / 180;
      const transform = `translate(${x}, ${y}) rotate(${seg.angle})`;

      x += seg.size * Math.cos(rad);
      y += seg.size * Math.sin(rad);

      return (
        <g key={idx} transform={transform}>
          <rect
            x={0}
            y={-barWidth / 2}
            width={seg.size}
            height={barWidth}
            fill="#798645"
          />
          <circle
            cx={seg.size}
            cy={0}
            r={barWidth / 2}
            fill="#798645"
          />
        </g>
      );
    });
  };

  return (
    <div
      className="panel-container"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => { e.preventDefault(); handleMouseDown(e); }}
      onMouseUp={(e) => { e.preventDefault(); handleMouseUp(e); }}
      onTouchStart={(e) => { e.preventDefault(); handleMouseDown(e); }}
      onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(e); }}
      onTouchCancel={(e) => { e.preventDefault(); handleMouseUp(e); }}
    >
      <img
        src={BottleCapImage}
        alt="병뚜껑 이미지"
        className="bottle-cap-image"
        style={{ width: `${capWidth}px` }}
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
        {renderConfirmedSegments()}

        {isClicked && !gameOver && (
          <g
            transform={`translate(${curPivot.x}, ${curPivot.y}) rotate(${curRotation})`}
          >
            <rect
              x={0}
              y={-barWidth / 2}
              width={curSegmentLength}
              height={barWidth}
              fill="#798645"
            />
            <circle
              cx={curSegmentLength}
              cy={0}
              r={barWidth / 2}
              fill="#798645"
            />
          </g>
        )}

        {!isClicked && !gameOver && (
          <g
            transform={`translate(${curPivot.x}, ${curPivot.y}) rotate(${curRotation})`}
          >
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
