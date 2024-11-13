import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";  // Import html2canvas
import MotifDisplay from "./components/MotifDisplay";
import EditPanel from "./components/EditPanel";
import affirmations from "./affirmations.json";
import "./App.css";
import "./ShopPage";

const colorOptions = ["#FFFFFF", "#000000", "#A7A7A7", "#494949", "#2C2A70", "#C81D25", "#4169E1", "#FFB6C1", "#228B22", "#800000", "#00A861", "#4B5320", "#E3D9C6", "#56A0D3", "#6A0DAD"];
const fontOptions = ["Playfair Display", "Montserrat", "Roboto Slab", "Lora", "Merriweather", "Raleway", "Bebas Neue"];

// Function to get text color based on background brightness
const getTextColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
  return brightness > 150 ? "#000000" : "#FFFFFF"; // Light background -> dark text, else light text
};

const App = () => {
  const [selectedFont, setSelectedFont] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [affirmation, setAffirmation] = useState({ main: "", sub: "" });
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);  // Track if the motif was edited
  const panelRef = useRef(null);
  const motifRef = useRef(null); // Reference to the motif container

  // Function to get URL parameters
  const getURLParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get("text");
    const color = urlParams.get("color");
    const font = urlParams.get("font");
    return { text, color, font };
  };

  // Set a random initial color, font, and affirmation on first load or use URL params
  useEffect(() => {
    const { text, color, font } = getURLParams();

    if (text && color && font) {
      const matchingAffirmation = affirmations.find((aff) => aff.main === text);
      if (matchingAffirmation) {
        setAffirmation({ main: matchingAffirmation.main, sub: matchingAffirmation.sub });
      } else {
        setAffirmation({ main: text, sub: text }); // If not found, just use the text for both
      }

      setBgColor(color);
      setSelectedFont(font);
    } else {
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      const randomFont = fontOptions[Math.floor(Math.random() * fontOptions.length)];
      setAffirmation(randomAffirmation);
      setBgColor(randomColor);
      setSelectedFont(randomFont);
    }
  }, []);

  // Update the URL only when the motif is edited (not initially)
  useEffect(() => {
    if (hasEdited) {
      const updateURL = () => {
        const url = `${window.location.href.split('?')[0]}?text=${encodeURIComponent(affirmation.main)}&color=${encodeURIComponent(bgColor)}&font=${encodeURIComponent(selectedFont)}`;
        window.history.pushState({ path: url }, "", url); // Update URL without reloading the page
      };

      updateURL(); // Call it to update the URL when the motif is edited
    }
  }, [affirmation, bgColor, selectedFont, hasEdited]);

  // Generate shareable link with current motif settings
  const generateShareLink = () => {
    const url = `${window.location.href.split('?')[0]}?text=${encodeURIComponent(affirmation.main)}&color=${encodeURIComponent(bgColor)}&font=${encodeURIComponent(selectedFont)}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  // Function to download the motif as PNG using html2canvas
  const downloadMotifAsPNG = () => {
    if (motifRef.current) {
      // Wait for fonts to load using WebFontLoader
      html2canvas(motifRef.current, {
        backgroundColor: bgColor, // Ensures the background color is captured
        useCORS: true, // If you have any cross-origin images, this will allow them to be captured
        scale: 2, // Optional: Increases resolution of the downloaded image
        logging: true, // Optional: Logs html2canvas progress for debugging
      }).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "motif.png"; // Name of the file
        link.click(); // Trigger the download
      });
    }
  };
  // Shop this motif button
  // Inside App.jsx

const shopThisMotif = () => {
  const backgroundColor = bgColor;  // Get the selected background color for the product
  const font = selectedFont;        // Get the selected font
  const mainText = affirmation.main;  // Get the main text of the affirmation

  // Create a shareable URL with the motif details (text, color, and font)
  const url = `${window.location.origin}/shop?text=${encodeURIComponent(mainText)}&color=${encodeURIComponent(backgroundColor)}&font=${encodeURIComponent(font)}`;

  // Navigate to the shop page with the generated URL
  window.location.href = url;  // Redirect to the shop page
};


  // Close the edit panel if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowEditPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="App">
      <div className="button-container">
      <button onClick={shopThisMotif}>Shop This Motif</button>
        <button onClick={generateShareLink}>Share</button>
        <button onClick={() => setShowEditPanel(!showEditPanel)}>Edit Motif</button>
        <button onClick={downloadMotifAsPNG}>Download as PNG</button> {/* PNG download button */}
      </div>
      <div ref={motifRef}> {/* Wrap MotifDisplay in a div that html2canvas will reference */}
        <MotifDisplay affirmation={affirmation} font={selectedFont} bgColor={bgColor} />
      </div>
      {showEditPanel && (
        <div ref={panelRef}>
          <EditPanel
            selectedFont={selectedFont}
            onFontChange={(font) => { setSelectedFont(font); setHasEdited(true); }}
            selectedColor={bgColor}
            onColorChange={(color) => { setBgColor(color); setHasEdited(true); }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
