import React from "react";
import PanelBorderImage from "../images/GameScreen/PanelBorderImage.svg";
import PanelMaskImage from "../images/GameScreen/PanelMaskImage.svg";

import "./GamePanel.css";

const GamePanel = () => {
  return (
    <div className="container">
      <img
        src={PanelMaskImage}
        alt="패널 마스크 이미지"
        className="background"
      />
      <img
        src={PanelBorderImage}
        alt="패널 경계선 이미지"
        className="background"
      />
    </div>
  );
};

export default GamePanel;