import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Home"; // Import the Home component
import "./ShopPage"; // Import the ShopPage component

const App = () => {
  return (
    <Router> {/* Wrap the entire app in Router */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route to Home page */}
        <Route path="/shop" element={<ShopPage />} /> {/* Route to Shop page */}
      </Routes>
    </Router>
  );
};

export default App;
