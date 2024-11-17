import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import ThemeToggle from "./ThemeToggle";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

const Navbar = ({ theme, toggleTheme }) => {
  const [selectedItem, setSelectedItem] = useState(null);
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
        : currentPath === "/about"
        ? "about"
        : null
    );
  }, [location.pathname]);

  const logo =
    theme === "dark" ? "onesandzeros-dark.png" : "onesandzeros-light.png";

  return (
    <nav className="navbar">
      <div className="logotext">
        <img
          alt="Ones and Zeros"
          src={logo}
          style={{ height: "50px", paddingRight: "10px" }}
        />
      </div>
      <Link className="mobile-icon">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </Link>
      <ul className="navbar-links">
        <li className={selectedItem === "home" ? "selected" : ""}>
          <Link to="/" onClick={() => setSelectedItem("home")}>
          <div class="logo-container">
            <HomeOutlinedIcon className="nav-icon" />
            <span className="nav-text">Home</span>
          </div>
          </Link>
        </li>
        <li className={selectedItem === "blog" ? "selected" : ""}>
          <div class="logo-container">
            <Link to="/blog" onClick={() => setSelectedItem("blog")}>
            <div class="logo-container">
              <LibraryBooksOutlinedIcon className="nav-icon" />
              <span className="nav-text">Blogs</span>
            </div>
          </Link>
        </div>
        </li>
        <li className={selectedItem === "projects" ? "selected" : ""}>
          <Link to="/projects" onClick={() => setSelectedItem("projects")}>
            <div class="logo-container">
              <WorkOutlineOutlinedIcon className="nav-icon" />
              <span className="nav-text">Projects</span>
            </div>
          </Link>
        </li>
        <li className={selectedItem === "about" ? "selected" : ""}>
          <Link to="/about" onClick={() => setSelectedItem("about")}>
            <div class="logo-container">
              <PermIdentityOutlinedIcon className="nav-icon" />
              <span className="nav-text">About</span>
            </div>
          </Link>
        </li>
      </ul>
      
      <Link className="pc-icon">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </Link>
    </nav>
  );
};

export default Navbar;
