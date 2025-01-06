import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import NavbarComponent from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Projects from "./components/Projects";
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop

function App() {
  const [theme, setTheme] = useState("dark");

  // Set initial theme based on localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.add(savedTheme + "-theme");
    } else {
      setTheme("dark");
      document.body.classList.add("dark-theme");
    }
  }, []);

  // Toggle between dark and light theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(newTheme + "-theme");
    localStorage.setItem("theme", newTheme); // Save theme in localStorage
  };

  const location = useLocation();

  return (
    <>
      <NavbarComponent toggleTheme={toggleTheme} theme={theme} />
      <ScrollToTop /> {/* Add this component here */}

      {/* Transition Group for Animating Routes */}
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key} // Unique key for each route
          classNames="page"   // Class for CSS transitions
          timeout={500}       // Match the CSS transition duration
        >
          <div className="page-transition">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Blog />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<Projects />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>

      <Footer />
    </>
  );
}

export default App;
