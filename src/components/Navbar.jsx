import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaSun } from "react-icons/fa";
import "../css/Navbar.css";

const NavbarComponent = ({ toggleTheme, theme }) => {  // Receive theme as a prop
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
          <img
            src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"}
            style={{ width: '140px' }}
            alt="Logo"
          />
        </Navbar.Brand>
        
        {/* Mobile Menu Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav ">
          <span className="material-icons menu-icon">
            menu
          </span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
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
            <Button
              onClick={toggleTheme}
              variant="link"
              className="mobile-links"
              style={{
                display: 'flex',
                marginTop: '5px',
                marginLeft: '20px',
                padding: 0,
                fontSize: '20px',
                lineHeight: '0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              {/* Toggle between Sun and Moon icons based on the theme */}
              {theme === "light" ? (
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#1d1d1d", fontSize: "30px" }}
                >
                  toggle_on
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#e8eaed", fontSize: "30px" }}
                  >
                  toggle_off
                </span>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
