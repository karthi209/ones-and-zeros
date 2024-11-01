import React from 'react';
import './css/Pages.css';
import XIcon from '@mui/icons-material/X';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {

  return (
    <div className='footer-custom'>
      <div className='footer-terms'>
        <p>Terms of Use</p>
      </div>
      <p>© 2024 Ones and Zeros</p>
      <div className='footer-logo'>
        <XIcon className='foticon'/>
        <EmailIcon className='foticon'/>
      </div>
    </div>
  )
}

export default Footer;