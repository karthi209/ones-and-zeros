import React from "react";
import "./css/Pages.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./css/BlogList.css";

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
        <section>
          <img src="welcome.gif" alt="welcome" className="homegif" />
        </section>
      </div>
    <div className="grid-columns">
      <section className="column column1">
          <h2 className="home-head">Featured Post</h2>
          <article className="post">
            <h3>Nothing at the moment still figuring it out :-)</h3>
            <p>Weill be right back with something...</p>
          </article>
        </section>
        <section className="column">
          <h2 className="home-head">Recent Posts</h2>
          <div>
            {posts.map((post) => (
              <Link
                to={`/blog/${post.postid}`}
                aria-label={`Read more about ${post.title}`}
              >
                <div><p>{post.category}</p></div>
                <h4 style={{ marginBottom: "5px" }}>{post.title}</h4>
                <div className="meta">
                  <p style={{ fontSize: "14px", marginTop: "0px" }}>
                    Posted on {new Date(post.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
