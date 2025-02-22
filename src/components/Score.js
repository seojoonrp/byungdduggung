import React, { useEffect, useState } from 'react';
import { answerSegments } from './Answer.js';
import { shapeSegmentsGlobal } from './GamePanel.js';

import "../styles/Score.css";

import BottleCapImage from "../images/GameScreen/BottleCapImage.svg";

/** 
 * 1) (ratio, deltaAngle) → 폴리라인(꼭지점) 변환
 */
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

/** 
 * 2) 폴리라인(꼭지점[])을 길이 기준으로 sampleCount등분 → (x, y) 점 목록
 */
function samplePolyline(vertices, sampleCount) {
  // 2-1) 각 선분 거리와 전체 길이 계산
  const segLengths = [];
  let totalDist = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    const dx = vertices[i + 1].x - vertices[i].x;
    const dy = vertices[i + 1].y - vertices[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    segLengths.push(dist);
    totalDist += dist;
  }

  // 2-2) sampleCount+1 개 포인트 등간격으로 분할
  const result = [];
  for (let s = 0; s <= sampleCount; s++) {
    const t = (s / sampleCount) * totalDist;
    result.push(interpolatePoint(vertices, segLengths, t));
  }
  return result;
}

/** 선분 배열에서 distT(0~totalDist) 위치의 점(x,y) 보간 */
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
  // distT가 전체 길이 초과 시 → 마지막 점
  return vertices[vertices.length - 1];
}

/** 
 * 3) 2D DTW 로직
 */
function pointDistance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function dtw2D(seqA, seqB) {
  const n = seqA.length;
  const m = seqB.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(Infinity)
  );
  dp[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = pointDistance2D(seqA[i - 1], seqB[j - 1]);
      dp[i][j] = cost + Math.min(
        dp[i - 1][j],
        dp[i][j - 1],
        dp[i - 1][j - 1]
      );
    }
  }
  return dp[n][m];
}


// 4) 점수 스케일링: 1~100
function scaledScore(distance) {
  const maxDist = 800;  // 필요에 따라 조절 (프로젝트 상황별)
  const d = Math.min(distance, maxDist);  // 넘으면 clamp
  const ratio = 1 - (d / maxDist);        // 0~1
  const score = 1 + 99 * ratio;           // 1~100
  return score; // float, 필요시 Math.round(score)
}

// compareSegments2D:
// (ratio, deltaAngle) → 2D 시퀀스 샘플링 → DTW → distance → 1~100 점수 + samplePoints(정답/사용자) 반환
function compareSegments2D() {
  console.log("Answer segments:", answerSegments);
  console.log("User shape segments:", shapeSegmentsGlobal);

  const totalLength = 100;  // "전체 막대 길이" 가정
  const sampleCount = 100;  // 샘플링 구간 수

  // (A) 폴리라인 복원
  const answerVerts = buildVertices(answerSegments, -90, 0, 0, totalLength);
  const userVerts = buildVertices(shapeSegmentsGlobal, -90, 0, 0, totalLength);

  // (B) 샘플링
  const answerPoints = samplePolyline(answerVerts, sampleCount);
  const userPoints = samplePolyline(userVerts, sampleCount);

  // (C) DTW
  const distance = dtw2D(answerPoints, userPoints);

  // (D) 1~100 점수 변환
  const score = scaledScore(distance * 0.5); // 이거는 보정 필요할 수 있음 0.5 값을 조절해서

  console.log(`distance = ${distance.toFixed(3)}, score(1~100) = ${score.toFixed(2)}`);

  // 시각화/리턴용
  return {
    distance,
    score,
    answerPoints,
    userPoints,
  };
}

// 5) 시각화 보조 함수
function toPathD(points) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x},${points[i].y}`;
  }
  return d;
}

function getBoundingBox(...arrays) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let arr of arrays) {
    for (let p of arr) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  return { minX, maxX, minY, maxY };
}

// 6) 시각화 (ShapeVisualizer)
function ShapeVisualizer({ answerPoints, userPoints, width, height }) {
  if (!answerPoints || !userPoints) return null;

  // 1) 고정된 viewBox
  //    예: (0,0)~(400,300)
  const viewBox = "0 0 400 300";

  // 2) path 변환
  const answerPath = toPathD(answerPoints);
  const userPath   = toPathD(userPoints);
  
  const scaleFactor = 5.78;    // 1.5배 확대
  const translateX = 104.7;      // x방향 50만큼 이동
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
        {/* 정답 폴리라인(연두색) */}
        <path d={answerPath} stroke="#BAC677" strokeWidth="2*(1/scaleFactor)" fill="none" strokeLinejoin="round"/>
        {/* 사용자 폴리라인(진한 초록) */}
        <path d={userPath} stroke="#798645" strokeWidth="2*(1/scaleFactor)" fill="none" strokeLinejoin="round" />
      </g>
    </svg>
  );
}


// 7) 실제 컴포넌트
function Score() {
  const [score, setScore] = useState(0);
  const [answerPts, setAnswerPts] = useState([]);
  const [userPts, setUserPts] = useState([]);

  const capWidth = 95;

  useEffect(() => {
    const result = compareSegments2D();
    setScore(result.score);
    setAnswerPts(result.answerPoints);
    setUserPts(result.userPoints);
  }, []);

  return (
    <div className="score-container">
      <span className="your-similarity-is">당신의 유사도는...!</span>
      <span className="similarity">{score.toFixed(2)}%</span>
      <div className="visualizer">
        <img
          src={BottleCapImage}
          alt="병뚜껑 이미지"
          className="score-bottle-cap-image"
          style={{ width: `${capWidth}px`,transform: "translateY(-25px)"}}
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
