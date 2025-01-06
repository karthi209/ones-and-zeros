import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaMoon, FaSun } from "react-icons/fa";
import "../css/Navbar.css";

const NavbarComponent = ({ toggleTheme }) => {
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
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/logo.png" style={{ width: '120px' }} alt="Logo" />
        </Navbar.Brand>
        
        {/* Mobile Menu Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/"
                active={selectedItem === "home"}
                onClick={() => setSelectedItem("home")}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/blog"
                active={selectedItem === "blog"}
                onClick={() => setSelectedItem("blog")}
              >
                Blogs
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/projects"
                active={selectedItem === "projects"}
                onClick={() => setSelectedItem("projects")}
              >
                Projects
              </Nav.Link>
            </Nav.Item>
            <Button onClick={toggleTheme} variant="outline-light">
              {/* Toggle between Sun and Moon icons */}
              {document.body.classList.contains("light-theme") ? <FaMoon /> : <FaSun />}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;