import React from "react";

const HowCalculated = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="how-calc" onClick={(e) => e.stopPropagation()}>
        <span className="how-calc-text">
          유사도는 Hausdorff의 거리 계산 방식으로 계산됩니다. <br />
          주어진 두 폴리라인 세그먼트(입력, 정답)을 동일한 개수의 점으로 나눈 후, <br />
          각 점 간의 최소 거리 중 가장 큰 것을 점수로 변환합니다. <br />
          이를 통해 궤적이 조금씩 변형되어도 비슷한 흐름을 인식할 수 있도록 합니다. <br />
        </span>
        <span className="how-calc-text" style={{ fontFamily: "Freesentation-7Bold", marginTop: 8 }}>
          즉, 완전히 일치하지 않더라도 전체적인 모양과 느낌이 비슷하면 <br />
          높은 유사도를 받을 수 있습니다.
        </span>
      </div>
    </div>
  );
};

export default HowCalculated;