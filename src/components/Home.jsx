import React from "react";
import "../css/Pages.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "../css/BlogList.css";

const Home = () => {

  const [posts, setPosts] = useState([]); 
  const [searchQuery, setSearchQuery ] = useState("");


  const fetchPosts = async (query = "") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bloglist${query ? `?query=${encodeURIComponent(query)}` : ''}`);
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = () => {
    fetchPosts(searchQuery);
  };

  return (
    <div className="container">
      <div className="centered-element">
        <section>
          <p>Welcome to my little corner of the web! I mostly post about computers and stuff, a little bit of transit map here and there and tons of rant about cities and stuff.</p>
          <p>Oh and also, if for some reason you need more rants, go over to <a href="https://x.com/karthi9003" target="_blank" rel="noopener noreferrer">Twitter (X)</a> to see more of my ranting.</p>
          <p style={{ fontSize: "12px", fontWeight: 400, textAlign: "left" }}>Last Updated: 29/12/2024</p>
        </section>
      </div>
    <div className="grid-columns">
      <section className="column column1">
          <div className="back">
            <h2 className="home-head">Featured</h2>
          </div>
          <div>
            {posts
              .sort((a, b) => new Date(b.publicationdate) - new Date(a.publicationdate)) // Sort by date
              .slice(0, 6) // Take the latest six posts
              .map((post) => (
                <div className="home-recents" key={post.slug}>
                  <h4 style={{ marginBottom: "5px" }}>{post.title}</h4>
                  <p style={{ fontSize: "13px", marginTop: "0px", color: "gray" }}>
                    Posted on{" "}
                    {new Date(post.publicationdate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="post-content-preview">
                    {post.content} {/* This shows the truncated content */}
                  </div>
                  <Link to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`}>
                    <span style={{ fontSize: "13px", marginTop: "0px" }}>Read More..</span>
                  </Link>
                </div>
              ))}
          </div>
        </section>
        <section className="column">
          <div className="back">
            <h2 className="home-head">Recent Posts</h2>
          </div>
          <div>
            {posts
              .sort((a, b) => new Date(b.publicationdate) - new Date(a.publicationdate)) // Sort by date
              .slice(0, 6) // Take the latest six posts
              .map((post) => (
                <div className="home-recents" key={post.slug}>
                  <h4 style={{ marginBottom: "5px" }}>{post.title}</h4>
                  <p style={{ fontSize: "13px", marginTop: "0px", color: "gray" }}>
                    Posted on{" "}
                    {new Date(post.publicationdate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="post-content-preview">
                    {post.content} {/* This shows the truncated content */}
                  </div>
                  <Link to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`}>
                    <span style={{ fontSize: "13px", marginTop: "0px" }}>Read More..</span>
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
