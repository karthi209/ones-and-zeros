import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(
      currentPath === "/"
        ? "home"
        : currentPath === "/blog"
        ? "blog"
        : currentPath === "/projects"
        ? "projects"
        : null
    );
  }, [location.pathname]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logotext">
        <img src="/logo.png" style={{ width: '120px' }} alt="Logo" />
      </div>
      
      {/* Mobile Menu Toggle */}
      <button 
        className={`mobile-icon ${isMobileMenuOpen ? 'opened' : ''}`} 
        onClick={handleMobileMenuToggle}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </button>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <li className={selectedItem === "home" ? "selected" : ""}>
          <Link to="/" onClick={() => setSelectedItem("home")}>
            <span className="nav-text">Home</span>
          </Link>
        </li>
        <li className={selectedItem === "blog" ? "selected" : ""}>
          <Link to="/blog" onClick={() => setSelectedItem("blog")}>
            <span className="nav-text">Blogs</span>
          </Link>
        </li>
        <li className={selectedItem === "projects" ? "selected" : ""}>
          <Link to="/projects" onClick={() => setSelectedItem("projects")}>
            <span className="nav-text">Projects</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
