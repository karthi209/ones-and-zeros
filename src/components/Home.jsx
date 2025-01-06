import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
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
      {/* Banner Section */}
      <section className="home-banner">
        <Container style={{ position: 'relative', marginTop: '30px', marginBottom: '30px', }}>
          <img
            src="/welcome.png"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '20px',
            }}
            className="welcome-img"
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '100px', // Align text to the right with some margin
              transform: 'translateY(-50%)', // Center vertically
              color: 'white',
              zIndex: '1',
              textAlign: 'right', // Align text to the right
              fontFamily: "Darker Grotesque",
              fontWeight: "600",
            }}
          >
            <h1 style={{ fontSize:  "40px" }}>Welcome to Pattinam</h1>
            <p style={{ fontSize:  "20px", fontWeight: "500" }}>Discover the heart of Chennai and Tamil Nadu through blogs and tools</p>
            <div className="banner-actions">
              <Button as={Link} to="/blog" variant="primary" className="mr-3" style={{ fontSize:  "19px", fontWeight: "500", }}>
                Read Blogs
              </Button>
              <Button as={Link} to="/tools" variant="secondary" style={{ fontSize:  "19px", fontWeight: "500" }}>
                Explore Maps
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <Container>
        {/* Featured and Recent Posts */}
        <Row>
          <Col md={6} className="mb-4">
            <h2 className="home-head">Featured</h2>
            {sortedPosts
              .slice(0, 3)
              .map((post) => (
                <Card key={post.slug} className="m3-card mb-3">
                  <Card.Body>
                    <Card.Title className="m3-card-title">{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 m3-card-subtitle">
                      Posted on{" "}
                      {new Date(post.publicationdate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Card.Subtitle>
                    <Card.Text className="m3-card-text">
                      {post.content.slice(0, 100)}...
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/blog/${post.slug}`}
                      aria-label={`Read more about ${post.title}`}
                      className="m3-read-more-button"
                    >
                      Read More
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </Col>
          <Col md={6} className="mb-4">
            <h2>Recent Posts</h2>
            {sortedPosts
              .slice(0, 3)
              .map((post) => (
                <Card key={post.slug} className="m3-card mb-3">
                  <Card.Body>
                    <Card.Title className="m3-card-title">{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 m3-card-subtitle">
                      Posted on{" "}
                      {new Date(post.publicationdate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Card.Subtitle>
                    <Card.Text className="m3-card-text">
                      {post.content.slice(0, 100)}...
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/blog/${post.slug}`}
                      aria-label={`Read more about ${post.title}`}
                      className="m3-read-more-button"
                    >
                      Read More
                    </Button>
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
