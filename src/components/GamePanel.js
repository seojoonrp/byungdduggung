import React, { useState } from "react";

import "./GamePanel.css";

import PanelBorderImage from "../images/GameScreen/PanelBorderImage.svg";
import BottleCapImage from "../images/GameScreen/BottleCapImage.svg"

const GamePanel = () => {
  const [curMode, setCurMode] = useState("Filling");

  return (
    <div className="container">
      <img
        src={BottleCapImage}
        alt="병뚜껑 이미지"
        className="bottle-cap-image"
      />
      <img
        src={PanelBorderImage}
        alt="패널 경계선 이미지"
        className="background-border"
      />
    </div>
  );
};

export default GamePanel;