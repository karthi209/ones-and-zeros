import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../css/Navbar.css";

const NavbarComponent = () => {
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
