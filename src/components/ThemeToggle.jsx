import React, { useState } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import "./css/Navbar.css";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleToggle = () => {
    toggleTheme();  // Call the passed toggleTheme function
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
  };

  return (
    <LightModeIcon onClick={handleToggle} className={`iconclass ${isRotating ? 'rotate' : ''}`} />
  );
};

export default ThemeToggle;