import React from 'react';
import './css/Pages.css';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import "./css/BlogList.css"

const Home = () => {

  const [home, setHome] = useState('');

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch(`/home.md`);
        const text = await response.text();
        setHome(text);
      } catch (error) {
        console.error('Error loading post:', error);
      }
    };
    fetchHome();
  }, []);

  return (
    <div className='pages-custom'>
      <ReactMarkdown className='blog'>{home}</ReactMarkdown>
    </div>
  );
};

export default Home