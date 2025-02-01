import React, { useEffect } from 'react';
import { answerSegments } from './answer.js'
import {shapeSegmentsGlobal} from './GamePanel.js';

/** (A) angleDistance: 각도 차를 0~180 범위로 잡기 위한 보조 함수 */
function angleDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

/** (B) 세그먼트 간 거리 함수 */
function segmentDistance(segA, segB) {
  // 가중치
  const wRatio = 1.0;
  const wAngle = 0.01;

  const ratioDiff = Math.abs(segA.ratio - segB.ratio);
  const angleDiff = angleDistance(segA.deltaAngle, segB.deltaAngle);

  return wRatio * ratioDiff + wAngle * angleDiff;
}

/** (C) DTW 알고리즘 */
function dtwDistance(seqA, seqB) {
  const n = seqA.length;
  const m = seqB.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(Infinity)
  );
  dp[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = segmentDistance(seqA[i - 1], seqB[j - 1]);
      dp[i][j] = cost + Math.min(
        dp[i - 1][j],
        dp[i][j - 1],
        dp[i - 1][j - 1]
      );
    }
  }
  return dp[n][m];
}

/** (D) 유사도(0~1) 스코어 */
function similarityScore(distance) {
  return 1 / (1 + distance);
}

/** (E) 두 시퀀스 비교 후 유사도 반환 */
function compareSegments() {
  console.log(answerSegments);
  console.log(shapeSegmentsGlobal);

  const distance = dtwDistance(answerSegments, shapeSegmentsGlobal);
  const similarity = similarityScore(distance);

  console.log(`DTW Distance = ${distance}`);
  console.log(`Similarity = ${similarity.toFixed(4)}`);

  return similarity;
}

/**
 * Score 컴포넌트
 * - 내부에는 유사도 표시 X
 * - 부모에게만 전달
 */
const Score = ({ onSimilarityChange }) => {
  const sim = compareSegments();

  useEffect(() => {
    if (onSimilarityChange) {
      onSimilarityChange(sim);
    }
  }, [sim, onSimilarityChange]);

  // 아무것도 렌더링하지 않음 (또는 간단한 빈 div만)
  return null; 
};

export default Score;
