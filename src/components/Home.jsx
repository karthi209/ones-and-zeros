import React from "react";
import "./css/Pages.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./css/BlogList.css";

const Home = () => {
  const [home, setHome] = useState("");

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch(`/home.md`);
        const text = await response.text();
        setHome(text);
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };
    fetchHome();
  }, []);

  return (
    <div className="pages-custom">
      <section class="welcome">
        <h1 className="test">Welcome, fellow humans!</h1>
        <a>This is a website dedicated for all my mapping projects and blog posts. This website is still under-construction!</a>
      </section>
      <section class="featured">
        <h2 className="home-head">Featured Post</h2>
        <article class="post">
          <h3><a href="blog/1.html">Setting Up a Local Development Server with Node.js</a></h3>
          <p>Running a Node.js server in WSL2 allows for efficient, VM-like environments right inside your Windows OS...</p>
          <a href="blog/1.html" class="read-more">Read More</a>
        </article>
      </section>

      <section class="recent-posts">
        <h2 className="home-head">Recent Posts</h2>
        <div class="posts-grid">
          <article class="post">
            <h3><a href="blog/2.html">Setting Up a Local Development Server with Node.js in WSL2</a></h3>
            <p>A guide to running Node.js servers on WSL2 for efficient development.</p>
          </article>
          <article class="post">
            <h3><a href="blog/3.html">Configuring Docker to Work Across WSL2 and Windows</a></h3>
            <p>Learn how to integrate Docker across your WSL2 and Windows environments.</p>
          </article>
          <article class="post">
            <h3><a href="blog/4.html">Using Git from WSL2 for Windows Projects</a></h3>
            <p>Explore how to use Git in WSL2 to manage projects hosted on Windows.</p>
          </article>
          <article class="post">
            <h3><a href="blog/5.html">Running Jupyter Notebooks on WSL2</a></h3>
            <p>Make Jupyter Notebooks accessible via your browser for a smoother workflow.</p>
          </article>
          <article class="post">
            <h3><a href="/posts/python-web-wsl2.html">Running Python Web Applications on WSL2</a></h3>
            <p>Set up Python web applications and expose them to your network.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
