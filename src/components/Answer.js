import React from "react";

export const answerSegments = [
  { ratio: 0.225, deltaAngle: 45 },
  { ratio: 0.225, deltaAngle: 90 },
  { ratio: 0.200, deltaAngle: -135 },
  { ratio: 0.040, deltaAngle: 90 },
  { ratio: 0.040, deltaAngle: 180 },
  { ratio: 0.050, deltaAngle: 90 },
  { ratio: 0.040, deltaAngle: 90 },
  { ratio: 0.040, deltaAngle: 180 },
  { ratio: 0.070, deltaAngle: 90 },
  { ratio: 0.070, deltaAngle: -90 },
];

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

export default AnswerShapeRenderer;
