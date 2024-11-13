// src/pages/ShopPage.jsx
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';

const PRINTFUL_API_KEY = 'GRuG5AwMQn84C874yOACR5MvxajeSrCfpTe3yeFC'; // Make sure to replace with your Printful API key

// Function to extract URL parameters
const getURLParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const text = urlParams.get('text');
  const color = urlParams.get('color');
  const font = urlParams.get('font');
  return { text, color, font };
};

// Function to get text color based on background brightness
const getTextColor = (bgColor) => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
  return brightness > 150 ? '#000000' : '#FFFFFF'; // Light background -> dark text, else light text
};

const ShopPage = () => {
  const [motif, setMotif] = useState({ main: '', sub: '' });
  const [bgColor, setBgColor] = useState('');
  const [selectedFont, setSelectedFont] = useState('');
  const [mockups, setMockups] = useState([]);

  // Extract URL parameters and set motif details when the shop page loads
  useEffect(() => {
    const { text, color, font } = getURLParams();
    if (text && color && font) {
      setMotif({ main: text, sub: text }); // Assuming subtext is the same as main text for now
      setBgColor(color);
      setSelectedFont(font);
    }
  }, []);

  // Generate the motif image as PNG with transparent background
  const generateMotifPNG = (container) => {
    html2canvas(container, {
      backgroundColor: null,  // Ensure the background is transparent
      logging: true,
      useCORS: true,
      scale: 3  // Scale for 300 DPI (high-res image)
    }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      createProductWithImage(dataURL, bgColor);
    }).catch((error) => {
      console.error('Error generating PNG:', error);
    });
  };

  // Function to send the PNG image to Printful API and generate mockups
  const createProductWithImage = async (imageDataUrl, backgroundColor) => {
    const productData = {
      variant_ids: [101, 102, 103],  // Example product variant IDs (T-shirt, Hoodie, Mug, etc.)
      files: [
        {
          url: imageDataUrl,  // PNG image of the motif with transparent background
          type: 'png'
        }
      ],
      retail_price: '20.00',  // Product price (you can adjust)
      color: backgroundColor  // Background color for the product
    };

    try {
      const response = await axios.post('https://api.printful.com/products/create', productData, {
        headers: { 'Authorization': `Bearer ${PRINTFUL_API_KEY}` }
      });

      const productMockups = response.data.mockups;
      setMockups(productMockups);  // Store mockups for later rendering
    } catch (error) {
      console.error('Error creating product on Printful:', error);
    }
  };

  // Generate shareable link with current motif settings
  const generateShareLink = () => {
    const url = `${window.location.origin}/shop?text=${encodeURIComponent(motif.main)}&color=${encodeURIComponent(bgColor)}&font=${encodeURIComponent(selectedFont)}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="shop-page">
      <h1>{motif.main}</h1>
      <p>{motif.sub}</p>
      <div 
        className="container" 
        style={{ backgroundColor: bgColor, fontFamily: selectedFont }}
        ref={(el) => generateMotifPNG(el)} // Capture the motif on page load
      >
        <h1>{motif.main}</h1>
        <p>{motif.sub}</p>
        {/* Further product mockups can be rendered below */}
      </div>

      {/* Buttons */}
      <button onClick={generateShareLink}>Generate Shareable Link</button>

      {/* Display Product Mockups */}
      <div className="product-mockups">
        {mockups.length > 0 ? (
          mockups.map((mockup) => (
            <div key={mockup.product_type}>
              <h3>{mockup.product_type}</h3>
              <img src={mockup.preview_url} alt={mockup.product_type} />
              <button>Add to Cart</button> {/* Add to Cart button for mockup */}
            </div>
          ))
        ) : (
          <p>Loading mockups...</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
