import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import ThemeToggle from "./ThemeToggle";

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
    theme === "dark" ? "onesandzeros-dark.png" : "onesandzeros-dark.png";

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
            HOME
          </Link>
        </li>
        <li className={selectedItem === "blog" ? "selected" : ""}>
          <Link to="/blog" onClick={() => setSelectedItem("blog")}>
            BLOGS
          </Link>
        </li>
        <li className={selectedItem === "projects" ? "selected" : ""}>
          <Link to="/projects" onClick={() => setSelectedItem("projects")}>
            PROJECTS
          </Link>
        </li>
        <li className={selectedItem === "about" ? "selected" : ""}>
          <Link to="/about" onClick={() => setSelectedItem("about")}>
            ABOUT
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
