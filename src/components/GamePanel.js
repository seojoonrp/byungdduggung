import { useState, useEffect } from "react";
import "../styles/GamePanel.css";

import PanelBorderImage from "../images/GameScreen/PanelBorderImage.svg";
import BottleCapImage from "../images/GameScreen/BottleCapImage.svg";

/** (추가) shapeSegmentsGlobal: 컴포넌트 외부에 있는 변수
 *  'named export'로 내보내서 다른 파일에서 import 가능
 */
export let shapeSegmentsGlobal = [];

const GamePanel = () => {
  const capWidth = 75;
  const barWidth = 2.5;
  const totalLength = Math.PI * capWidth; // 병뚜껑 둘레

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
  const [curPivot, setCurPivot] = useState({ x: 105, y: 338 });

  // (G) 마우스 클릭 상태
  const [isClicked, setIsClicked] = useState(false);

  // (H) 현재 클릭 중인 세그먼트 길이(픽셀)
  const [curSegmentLength, setCurSegmentLength] = useState(0);

  // (I) 게임 종료 여부
  const [gameOver, setGameOver] = useState(false);

  /** (1) 마우스가 눌려 있지 않고 게임 오버가 아니며, 막대가 1 미만이면 → 채우기 */
  useEffect(() => {
    if (!gameOver && !isClicked && curRatio < 1) {
      const fillInterval = setInterval(() => {
        setCurRatio((prev) => Math.min(prev + fillSpeed, 1));
      }, frameTime);

      return () => clearInterval(fillInterval);
    }
  }, [gameOver, isClicked, curRatio]);

  /** (2) 마우스가 눌려 있고 게임 오버가 아니면 → 회전 */
  useEffect(() => {
    if (!gameOver && isClicked) {
      const rotateInterval = setInterval(() => {
        setCurRotation((prev) => prev + rotationSpeed);
      }, frameTime);

      return () => clearInterval(rotateInterval);
    }
  }, [gameOver, isClicked]);

  /** (3) 마우스 다운(클릭 시작) */
  const handleMouseDown = () => {
    if (gameOver) return; // 이미 끝났으면 무시

    const segRatio = curRatio - confirmedRatio;
    const segSize = segRatio * totalLength;
    setCurSegmentLength(segSize);

    setIsClicked(true);
  };

  /** (4) 마우스 업(클릭 해제) → 세그먼트 확정 */
  const handleMouseUp = () => {
    if (gameOver) return; // 이미 끝났으면 무시

    const segRatio = curRatio - confirmedRatio; // 이번 세그먼트 비율
    const segSize = segRatio * totalLength;     // 픽셀 길이

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
      // (추가) 전역 변수 shapeSegmentsGlobal도 동기화
      shapeSegmentsGlobal = updated;
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
      // 한 번 더 shapeSegments에 최종 세그먼트 추가? 
      // (이미 위에서 1회 추가함)
      // 게임 오버
      setGameOver(true);
    }
  };

  /** pivot(회전축) 업데이트 함수 */
  const calculateNewPivot = (segmentSize, absoluteAngle) => {
    const radRotation = (absoluteAngle * Math.PI) / 180;
    return {
      x: curPivot.x + segmentSize * Math.cos(radRotation),
      y: curPivot.y + segmentSize * Math.sin(radRotation),
    };
  };

  /** (5) 이미 확정된 세그먼트 렌더링 */
  const renderConfirmedSegments = () => {
    let x = 105;
    let y = 338;

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
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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

        {/* 클릭 중이 아닐 때 남은 부분 (빨간+옅은색) */}
        {!isClicked && !gameOver && (
          <g
            transform={`translate(${curPivot.x}, ${curPivot.y}) rotate(${curRotation})`}
          >
            {/* 전체 남은 구간(옅은색) */}
            <rect
              x={0}
              y={-barWidth / 2}
              width={(1 - confirmedRatio) * totalLength}
              height={barWidth}
              fill="#BAC677"
            />
            {/* 현재까지 채워진 부분(빨간색) */}
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
