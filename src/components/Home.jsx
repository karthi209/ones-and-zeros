import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Container } from "react-bootstrap";
import "../css/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async (query = "") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bloglist${
          query ? `?query=${encodeURIComponent(query)}` : ""
        }`
      );
      const data = await response.json();
      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else {
        throw new Error("Expected an array of posts");
      }
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

  const sortedPosts = Array.isArray(posts)
    ? posts.sort((a, b) => new Date(b.publicationdate) - new Date(a.publicationdate))
    : [];

  return (
    <div className="home-container">
      <Container>
        <div className="centered-element">
          <section>
            <p className="text-white">
              Welcome to my little corner of the web! I mostly post about computers and stuff, a little bit of transit map here and there, and tons of rant about cities and stuff.
            </p>
            <p className="text-white">
              Oh and also, if for some reason you need more rants, go over to <a href="https://x.com/karthi9003" target="_blank" rel="noopener noreferrer">Twitter (X)</a> to see more of my ranting.
            </p>
            <p className="text-white" style={{ fontSize: "12px", fontWeight: 400, textAlign: "left" }}>
              Last Updated: 29/12/2024
            </p>
          </section>
        </div>

        <Row>
          {/* Featured Posts */}
          <Col md={6} className="mb-4">
            <h2 className="home-head">Featured</h2>
            {sortedPosts
              .slice(0, 5)
              .map((post) => (
                <Card key={post.slug} className="home-card mb-3">
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Posted on{" "}
                      {new Date(post.publicationdate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Card.Subtitle>
                    <Card.Text className="post-content-preview">{post.content}</Card.Text>
                    <Link to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`} className="read-more-link">
                      Read More...
                    </Link>
                  </Card.Body>
                </Card>
              ))}
          </Col>

          {/* Recent Posts */}
          <Col md={6} className="mb-4">
            <h2 className="home-head">Recent Posts</h2>
            {sortedPosts
              .slice(0, 5)
              .map((post) => (
                <Card key={post.slug} className="home-card mb-3">
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Posted on{" "}
                      {new Date(post.publicationdate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Card.Subtitle>
                    <Card.Text className="post-content-preview">{post.content}</Card.Text>
                    <Link to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`} className="read-more-link">
                      Read More...
                    </Link>
                  </Card.Body>
                </Card>
              ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;