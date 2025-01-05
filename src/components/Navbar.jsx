import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
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
        : null
    );
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="logotext">
        {/* <p>karthi(209)</p> */}
        <img src={`logo.png`} style={{ width: '120px' }} alt="Logo"/>
      </div>
      <ul className="navbar-links">
        <li className={selectedItem === "home" ? "selected" : ""}>
          <Link to="/" onClick={() => setSelectedItem("home")}>
          <div class="logo-container">
            <span className="nav-text">Home</span>
          </div>
          </Link>
        </li>
        <li className={selectedItem === "blog" ? "selected" : ""}>
          <div class="logo-container">
            <Link to="/blog" onClick={() => setSelectedItem("blog")}>
            <div class="logo-container">
              <span className="nav-text">Blogs</span>
            </div>
          </Link>
        </div>
        </li>
        <li className={selectedItem === "projects" ? "selected" : ""}>
          <Link to="/projects" onClick={() => setSelectedItem("projects")}>
            <div class="logo-container">
              <span className="nav-text">Projects</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
