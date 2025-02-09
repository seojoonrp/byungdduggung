import React from "react";

// (1) 정답 이미지 배열만 별도로 내보냄
export const answerSegments = [
  { ratio: 0.22508, deltaAngle: 45 },
  { ratio: 0.22508, deltaAngle: 90 },
  { ratio: 0.20000, deltaAngle: -135 },
  { ratio: 0.04000, deltaAngle: 90 },
  { ratio: 0.04000, deltaAngle: 180 },
  { ratio: 0.05000, deltaAngle: 90 },
  { ratio: 0.04000, deltaAngle: 90 },
  { ratio: 0.04000, deltaAngle: 180 },
  { ratio: 0.06992, deltaAngle: 90 },
  { ratio: 0.06992, deltaAngle: -90 },
];

// (2) 컴포넌트 로직에서 이 answerSegments를 import 해서 사용해도 되고,
//    직접 여기서 써도 되지만, 편의상 그대로 사용
const AnswerShapeRenderer = () => {
  const totalLength = 50;
  const barWidth = 1.5;
  const startAngle = -90;
  const startPivot = { x: 15, y: 25 };

  const renderAnswerShape = () => {
    let pivotX = startPivot.x;
    let pivotY = startPivot.y;
    let absAngle = startAngle;

    return answerSegments.map((seg, index) => {
      const segLength = seg.ratio * totalLength;
      absAngle += seg.deltaAngle;

      const transform = `translate(${pivotX}, ${pivotY}) rotate(${absAngle})`;
      const rad = (absAngle * Math.PI) / 180;
      pivotX += segLength * Math.cos(rad);
      pivotY += segLength * Math.sin(rad);

      return (
        <g key={index} transform={transform}>
          <rect
            x={0}
            y={-barWidth / 2}
            width={segLength}
            height={barWidth}
            fill="#798645"
          />
          <circle
            cx={segLength}
            cy={0}
            r={barWidth / 2}
            fill="#798645"
          />
        </g>
      );
    });
  };

  return (
    <div style={{ border: "1px solid #ccc", width: "fit-content" }}>
      <svg width={50} height={50} style={{ background: "#fff" }}>
        {renderAnswerShape()}
      </svg>
    </div>
  );
};

// 디폴트로 컴포넌트만 export
export default AnswerShapeRenderer;
