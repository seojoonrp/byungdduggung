import React, { useEffect, useState } from 'react';
import { answerSegments } from './Answer.js';
import { shapeSegmentsGlobal } from './GamePanel.js';

import "../styles/Score.css";

import BottleCapImage from "../images/GameScreen/BottleCapImage.svg";

function buildVertices(segments, startAngle = -90, startX = 0, startY = 0, totalLength = 1) {
  let angle = startAngle;
  let x = startX;
  let y = startY;

  const vertices = [{ x, y }];

  for (let i = 0; i < segments.length; i++) {
    const { ratio, deltaAngle } = segments[i];
    angle += deltaAngle;

    const segLen = ratio * totalLength;
    const rad = (angle * Math.PI) / 180;
    x += segLen * Math.cos(rad);
    y += segLen * Math.sin(rad);

    vertices.push({ x, y });
  }
  return vertices;
}

function samplePolyline(vertices, sampleCount) {
  const segLengths = [];
  let totalDist = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    const dx = vertices[i + 1].x - vertices[i].x;
    const dy = vertices[i + 1].y - vertices[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    segLengths.push(dist);
    totalDist += dist;
  }

  const result = [];
  for (let s = 0; s <= sampleCount; s++) {
    const t = (s / sampleCount) * totalDist;
    result.push(interpolatePoint(vertices, segLengths, t));
  }
  return result;
}

function interpolatePoint(vertices, segLengths, distT) {
  let curDist = 0;
  for (let i = 0; i < segLengths.length; i++) {
    const segLen = segLengths[i];
    const start = vertices[i];
    const end = vertices[i + 1];

    if (curDist + segLen >= distT) {
      const ratio = (distT - curDist) / segLen;
      const x = start.x + (end.x - start.x) * ratio;
      const y = start.y + (end.y - start.y) * ratio;
      return { x, y };
    }
    curDist += segLen;
  }

  return vertices[vertices.length - 1];
}

function pointDistance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function hausdorff2D(seqA, seqB) {
  let maxAB = 0;
  for (const a of seqA) {
    let minDist = Infinity;
    for (const b of seqB) {
      const dist = pointDistance2D(a, b);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    if (minDist > maxAB) {
      maxAB = minDist;
    }
  }

  let maxBA = 0;
  for (const b of seqB) {
    let minDist = Infinity;
    for (const a of seqA) {
      const dist = pointDistance2D(a, b);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    if (minDist > maxBA) {
      maxBA = minDist;
    }
  }

  return Math.max(maxAB, maxBA);
}
function scaledScore(distance) {
  if (distance < 0) distance = 0;

  if (distance <= 5) {
    return 11.57 * Math.exp(-0.5 * distance) + 88.43;
  } else if (distance < 30) {
    const s5 = 11.57 * Math.exp(-0.5 * 5) + 88.43;
    return s5 * (1 - (distance - 5) / 25);
  } else {
    return 0;
  }
}

function compareSegments2D() {

  const totalLength = 100;
  const sampleCount = 100;

  const answerVerts = buildVertices(answerSegments, -90, 0, 0, totalLength);
  const userVerts = buildVertices(shapeSegmentsGlobal, -90, 0, 0, totalLength);

  const answerPoints = samplePolyline(answerVerts, sampleCount);
  const userPoints = samplePolyline(userVerts, sampleCount);

  const distance = hausdorff2D(answerPoints, userPoints);

  const score = scaledScore(distance);

  return {
    distance,
    score,
    answerPoints,
    userPoints,
  };
}

function toPathD(points) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x},${points[i].y}`;
  }
  return d;
}

function ShapeVisualizer({ answerPoints, userPoints, width, height }) {
  if (!answerPoints || !userPoints) return null;

  const viewBox = "0 0 400 300";

  const answerPath = toPathD(answerPoints);
  const userPath = toPathD(userPoints);

  const scaleFactor = 5.78;
  const translateX = 104.7;
  const translateY = 249;
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className="visualizer-svg"
    >
      <g transform={`
        translate(${translateX}, ${translateY}) 
        scale(${scaleFactor})
      `}>
        <path d={answerPath} stroke="#BAC677" strokeWidth="2*(1/scaleFactor)" fill="none" strokeLinejoin="round" />
        <path d={userPath} stroke="#798645" strokeWidth="2*(1/scaleFactor)" fill="none" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Score({ onSimilarityChange, isShown = true }) {
  const [score, setScore] = useState(0);
  const [answerPts, setAnswerPts] = useState([]);
  const [userPts, setUserPts] = useState([]);

  const capWidth = 95;

  useEffect(() => {
    const result = compareSegments2D();
    setScore(result.score);
    setAnswerPts(result.answerPoints);
    setUserPts(result.userPoints);

    if (onSimilarityChange) {
      onSimilarityChange(result.score);
    }
  }, []);

  if (!isShown) return null;

  return (
    <div className="score-container">
      <span className="your-similarity-is">당신의 유사도는...!</span>
      <span className="similarity">
        {score === 0 ? "0% ㅠㅠㅠ" : `${score.toFixed(2)}%`}
      </span>
      <div className="visualizer">
        <img
          src={BottleCapImage}
          alt="병뚜껑 이미지"
          className="score-bottle-cap-image"
          style={{ width: `${capWidth}px`, transform: "translateY(-25px)" }}
        />
        <ShapeVisualizer
          answerPoints={answerPts}
          userPoints={userPts}
          width={200}
          height={209.4}
        />
      </div>
    </div>
  );
}

export default Score;