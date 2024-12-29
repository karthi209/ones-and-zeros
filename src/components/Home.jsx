import React from "react";
import "./css/Pages.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./css/BlogList.css";

const Home = () => {
  return (
    <div className="container">
      <div className="centered-element">
        <section>
          <p>Welcome to my little corner of the web! I mostly post about computers and stuff, a little bit of transit map here and there and tons of rant about cities and stuff.</p>
          <p>Oh and also, if for some reason you need more rants, go over to <a href="https://x.com/karthi9003" target="_blank" rel="noopener noreferrer">Twitter (X)</a> to see more of my ranting.</p>
          <p style={{ fontSize: "12px", fontWeight: 400, textAlign: "right" }}>Last Updated: 29/12/2024</p>
        </section>
        <section>
          <img src="welcome.gif" alt="welcome" style={{ width: "200px", height: "auto" }} />
        </section>
      </div>
    <div className="grid-columns">
      <section className="column column1">
          <h2 className="home-head">Featured Post</h2>
          <article className="post">
            <h3><a href="blog/1.html">Setting Up a Local Development Server with Node.js</a></h3>
            <p>Running a Node.js server in WSL2 allows for efficient, VM-like environments right inside your Windows OS...</p>
          </article>
        </section>
        <section className="column">
          <h2 className="home-head">Recent Posts</h2>
          <div className="posts-grid">
            <article className="post">
              <h3><a href="blog/2.html">Setting Up a Local Development Server with Node.js in WSL2</a></h3>
              <p>A guide to running Node.js servers on WSL2 for efficient development.</p>
            </article>
            <article className="post">
              <h3><a href="blog/3.html">Configuring Docker to Work Across WSL2 and Windows</a></h3>
              <p>Learn how to integrate Docker across your WSL2 and Windows environments.</p>
            </article>
            <article className="post">
              <h3><a href="blog/4.html">Using Git from WSL2 for Windows Projects</a></h3>
              <p>Explore how to use Git in WSL2 to manage projects hosted on Windows.</p>
            </article>
            <article className="post">
              <h3><a href="blog/5.html">Running Jupyter Notebooks on WSL2</a></h3>
              <p>Make Jupyter Notebooks accessible via your browser for a smoother workflow.</p>
            </article>
            <article className="post">
              <h3><a href="/posts/python-web-wsl2.html">Running Python Web Applications on WSL2</a></h3>
              <p>Set up Python web applications and expose them to your network.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
