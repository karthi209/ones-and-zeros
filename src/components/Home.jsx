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
      <section class="featured">
        <h2 className="home-head">Featured Post</h2>
        <article class="post">
          <h3><a href="/posts/exposing-service-in-wsl2.html">Exposing a Service Running in WSL2 to Network</a></h3>
          <p>Learn how to configure WSL2 to expose services to your local network, enabling remote device access...</p>
          <a href="/posts/exposing-service-in-wsl2.html" class="read-more">Read More</a>
        </article>
      </section>

      <section class="recent-posts">
        <h2 className="home-head">Recent Posts</h2>
        <div class="posts-grid">
          <article class="post">
            <h3><a href="/posts/nodejs-server-wsl2.html">Setting Up a Local Development Server with Node.js in WSL2</a></h3>
            <p>A guide to running Node.js servers on WSL2 for efficient development.</p>
          </article>
          <article class="post">
            <h3><a href="/posts/docker-wsl2.html">Configuring Docker to Work Across WSL2 and Windows</a></h3>
            <p>Learn how to integrate Docker across your WSL2 and Windows environments.</p>
          </article>
          <article class="post">
            <h3><a href="/posts/git-wsl2.html">Using Git from WSL2 for Windows Projects</a></h3>
            <p>Explore how to use Git in WSL2 to manage projects hosted on Windows.</p>
          </article>
          <article class="post">
            <h3><a href="/posts/jupyter-wsl2.html">Running Jupyter Notebooks on WSL2</a></h3>
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
