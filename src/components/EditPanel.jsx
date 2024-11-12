import React from "react";
import Select from "react-select";
import "./EditPanel.css";

const fontOptions = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Roboto Slab", label: "Roboto Slab" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Raleway", label: "Raleway" },
  { value: "Bebas Neue", label: "Bebas Neue" }
];

const colorOptions = ["#FFFFFF", "#000000", "#A7A7A7", "#494949", "#2C2A70", "#C81D25", "#4169E1", "#FFB6C1", "#228B22", "#800000", "#00A861", "#4B5320", "#E3D9C6", "#56A0D3", "#6A0DAD"];

const EditPanel = ({ selectedFont, onFontChange, selectedColor, onColorChange }) => {
  return (
    <div className="edit-panel">
      <h2>Edit Motif</h2>
      <div className="font-selector">
        <label>Choose Font</label>
        <Select
          options={fontOptions}
          defaultValue={fontOptions.find((font) => font.value === selectedFont)}
          onChange={(selectedOption) => onFontChange(selectedOption.value)}
          styles={{ 
            control: (provided) => ({ ...provided, color: "#333" }),
            option: (provided, state) => ({ 
              ...provided, 
              color: state.isSelected ? "#fff" : "#333", 
              backgroundColor: state.isSelected ? "#333" : "#fff" 
            }),
          }}
        />
      </div>
      <div className="color-picker">
        <label>Choose Background Color</label>
        <div className="color-options">
          {colorOptions.map((color) => (
            <div
              key={color}
              className={`color-box ${color === selectedColor ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditPanel;
