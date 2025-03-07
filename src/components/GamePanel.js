import { useState, useEffect } from "react";
import "../styles/GamePanel.css";

import BottleCapImage from "../images/GameScreen/BottleCapImage.svg";

export let shapeSegmentsGlobal = [];

const GamePanel = ({ isActive }) => {
  const capWidth = 75;
  const barWidth = 2.5;
  const totalLength = Math.PI * capWidth; // 병뚜껑 둘레
  const initialCoordX = 104;
  const initialCoordY = 338;

  const fillSpeed = 0.0035;
  const rotationSpeed = 2;
  const frameTime = 25;

  // (A) 막대 채움 비율 (0~1)
  const [curRatio, setCurRatio] = useState(0);
  const [confirmedRatio, setConfirmedRatio] = useState(0);

  // (B) 현재 회전(절대 각도: -90도부터 시작)
  const [curRotation, setCurRotation] = useState(-90);

  // (C) 렌더링용 세그먼트 정보 (절대 길이 + 절대 각도)
  const [renderSegments, setRenderSegments] = useState([]);

  // (D) DTW/Shape용 세그먼트 정보 (ratio + Δangle)
  const [shapeSegments, setShapeSegments] = useState([]);

  // (E) 직전 세그먼트 각도(Δangle 계산용)
  const [prevAngle, setPrevAngle] = useState(-90);

  // (F) 현재 막대 회전축 (SVG 좌표)
  const [curPivot, setCurPivot] = useState({ x: initialCoordX, y: initialCoordY });

  // (G) 마우스 클릭 상태
  const [isClicked, setIsClicked] = useState(false);

  // (H) 현재 클릭 중인 세그먼트 길이(픽셀)
  const [curSegmentLength, setCurSegmentLength] = useState(0);

  // (I) 게임 종료 여부
  const [gameOver, setGameOver] = useState(false);

  // (1) 마우스가 눌려 있지 않고 게임 오버가 아니며, 막대가 1 미만이면 채우기
  useEffect(() => {
    if (isActive && !gameOver && !isClicked && curRatio < 1) {
      const fillInterval = setInterval(() => {
        setCurRatio((prev) => Math.min(prev + fillSpeed, 1));
      }, frameTime);

      return () => clearInterval(fillInterval);
    }
  }, [isActive, gameOver, isClicked, curRatio]);

  // (2) 마우스가 눌려 있고 게임 오버가 아니면 회전
  useEffect(() => {
    if (isActive && !gameOver && isClicked) {
      const rotateInterval = setInterval(() => {
        setCurRotation((prev) => prev + rotationSpeed);
      }, frameTime);

      return () => clearInterval(rotateInterval);
    }
  }, [isActive, gameOver, isClicked]);

  // (3) 마우스 다운(클릭 시작)
  const handleMouseDown = (e) => {
    // prevent default 동작 추가
    if (e && e.preventDefault) e.preventDefault();
    if (!isActive || gameOver) return;

    const segRatio = curRatio - confirmedRatio;
    const segSize = segRatio * totalLength;
    setCurSegmentLength(segSize);

    setIsClicked(true);
  };

  // (4) 마우스 업(클릭 해제)시 세그먼트 확정
  const handleMouseUp = (e) => {
    // prevent default 동작 추가
    if (e && e.preventDefault) e.preventDefault();
    if (!isActive || gameOver) return;

    const segRatio = curRatio - confirmedRatio; // 이번 세그먼트 비율
    const segSize = segRatio * totalLength; // 픽셀 길이

    // Δangle = 지금 각도 - 이전 세그먼트 끝 각도
    const newAngle = curRotation;
    const deltaAngle = newAngle - prevAngle;

    // (4-1) 렌더링 세그먼트 추가
    setRenderSegments((prev) => [
      ...prev,
      { size: segSize, angle: newAngle },
    ]);

    // (4-2) Shape/DTW 세그먼트 추가
    setShapeSegments((prev) => {
      const updated = [...prev, { ratio: segRatio, deltaAngle }];
      shapeSegmentsGlobal = updated; // 전역 변수 동기화
      return updated;
    });

    // prevAngle 갱신
    setPrevAngle(newAngle);
    setConfirmedRatio(curRatio);

    // pivot 업데이트
    const newPivot = calculateNewPivot(segSize, newAngle);
    setCurPivot(newPivot);

    setIsClicked(false);

    // 마지막 세그먼트(막대가 100% 이상)
    if (curRatio >= 1) {
      setCurRatio(1);
      setGameOver(true);
    }
  };

  // (F) pivot(회전축) 업데이트 함수
  const calculateNewPivot = (segmentSize, absoluteAngle) => {
    const radRotation = (absoluteAngle * Math.PI) / 180;
    return {
      x: curPivot.x + segmentSize * Math.cos(radRotation),
      y: curPivot.y + segmentSize * Math.sin(radRotation),
    };
  };

  // (5) 이미 확정된 세그먼트 렌더링
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
      onContextMenu={(e) => e.preventDefault()}  // 우클릭 메뉴 방지
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
        {/* 이미 확정된 세그먼트들 */}
        {renderConfirmedSegments()}

        {/* 현재 클릭 중(회전 중)인 세그먼트 */}
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

        {/* 클릭 중이 아닐 때 남은 부분 */}
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
