import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ theme, toggleTheme }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(
      currentPath === '/' ? 'home' :
      currentPath === '/blog' ? 'blog' :
      currentPath === '/maps' ? 'maps' :
      currentPath === '/about' ? 'about' : null
    );
  }, [location.pathname]);

  const logo = theme === 'dark' ? 'onesandzeros-dark.png' : 'onesandzeros-logo.png';

  return (
    <nav className="navbar">
      <div className="logotext">
        <img
          alt="Ones and Zeros"
          src={logo}
          style={{ height: "35px", paddingRight: "10px" }}
        />
      </div>
      <Link className='mobile-icon'><ThemeToggle theme={theme} toggleTheme={toggleTheme} /></Link>
      <ul className="navbar-links">
        <li className={selectedItem === 'home' ? 'selected' : ''}>
          <Link to="/" onClick={() => setSelectedItem('home')}>HOME</Link>
        </li>
        <li className={selectedItem === 'blog' ? 'selected' : ''}>
          <Link to="/blog" onClick={() => setSelectedItem('blog')}>BLOGS</Link>
        </li>
        <li className={selectedItem === 'maps' ? 'selected' : ''}>
          <Link to="/maps" onClick={() => setSelectedItem('maps')}>MAPS</Link>
        </li>
        <li className={selectedItem === 'about' ? 'selected' : ''}>
          <Link to="/about" onClick={() => setSelectedItem('about')}>ABOUT</Link>
        </li>
      </ul>
      <Link className='pc-icon'><ThemeToggle theme={theme} toggleTheme={toggleTheme} /></Link>
    </nav>
  );
};

export default Navbar;