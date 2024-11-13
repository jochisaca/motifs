import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';  // Ensure this matches the file name
import ShopPage from `./ShopPage`; // Import the ShopPage component

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
