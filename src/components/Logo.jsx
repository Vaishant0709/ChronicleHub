import React from "react";
import logo from "../assets/logo.png"; // Relative path to the logo

function Logo({ width = '100px' }) {
  return (
    <img 
      src={logo} 
      alt="Logo" 
      style={{ width }} // Dynamically set the width
    />
  );
}

export default Logo;
