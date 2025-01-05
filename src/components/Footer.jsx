import React from "react";
import "../css/Pages.css";

function Footer() {
  return (
    <footer>
      <div class="footer-content">
        <p>© 2025 Pattinam.</p>
        <div class="footer-links">
          <a href="/privacy-policy" target="_blank">Privacy Policy</a>
          <a href="/terms-of-use" target="_blank">Terms of Use</a>
          <a href="https://twitter.com/karthi9003" target="_blank" aria-label="Follow us on Twitter">
            Twitter
          </a>
          <a href="https://github.com/karthi209" target="_blank" aria-label="Visit our GitHub">
            GitHub
          </a>
        </div>
        <div class="footer-contact">
          <p>Contact us at: <a href="mailto:info@209.com">info@209.com</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
