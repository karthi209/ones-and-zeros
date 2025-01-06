import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Projects from "./components/Projects";
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop

function App() {
  const [theme, setTheme] = useState("dark");

  // Toggle between dark and light theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.toggle("light-theme", newTheme === "light");
  };

  const location = useLocation();

  return (
    <>
      <Navbar toggleTheme={toggleTheme} />
      <ScrollToTop /> {/* Add this component here */}

      {/* Transition Group for Animating Routes */}
      <TransitionGroup component={null}> {/* Prevents wrapping element */}
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
