import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Projects from "./components/Projects";
import "./css/Pages.css";

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      
      {/* Transition Group for Animating Routes */}
      <TransitionGroup>
        <CSSTransition
          key={location.key} // Unique key for each route
          classNames="page"   // Class for CSS transitions
          timeout={500}       // Match the CSS transition duration
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<Projects />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      
      <Footer />
    </>
  );
}

export default App;
