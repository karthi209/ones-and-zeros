import React from "react";
import "../css/Footer.css"; // Import the CSS file

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>© 2025 Pattinam.</p>
        <p>This website is maintained by <a href="https://twitter.com/karthi9003" target="_blank" aria-label="karthi209">karthi209</a></p>
        <div className="footer-links">
          <a href="/privacy-policy" target="_blank">Privacy Policy</a>
          <a href="/terms-of-use" target="_blank">Terms of Use</a>
          <a href="https://twitter.com/karthi9003" target="_blank" aria-label="Follow us on Twitter">
            Twitter
          </a>
          <a href="https://github.com/karthi209" target="_blank" aria-label="Visit our GitHub">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
