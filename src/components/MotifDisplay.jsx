import React from "react";
import "./MotifDisplay.css";

const MotifDisplay = ({ affirmation, font, bgColor }) => {
  const getTextColor = () => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
    return brightness > 150 ? "#000000" : "#FFFFFF";
  };

  // Function to apply the orphan fix to prevent single-word lines
  const applyOrphanFix = (text) => {
    if (!text) return ""; // Return an empty string if text is undefined
    const words = text.trim().split(" ");
    if (words.length > 1) {
      return `${words.slice(0, -1).join(" ")}\u00A0${words[words.length - 1]}`;
    }
    return text;
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor, color: getTextColor(), fontFamily: font }}>
      <h1 style={{ fontFamily: font }}>{applyOrphanFix(affirmation.main || "")}</h1>
      <hr />
      <p style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "bold" }}>{applyOrphanFix(affirmation.sub || "")}</p>
    </div>
  );
};

export default MotifDisplay;
