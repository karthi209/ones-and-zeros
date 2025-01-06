import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Pagination } from "react-bootstrap";
import "../css/BlogList.css"; // Import the CSS file

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async (query = "", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bloglist${
          query ? `?query=${encodeURIComponent(query)}&` : "?"
        }page=${page}&limit=10`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setPosts(data.posts);
      setTotalPosts(data.totalPosts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError(error.message || "Error loading posts");
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(searchQuery, 1);
  };

  return (
    <Container className="blog-list-container">
      <Row>
        <Col>
          <div className="blog-header">
            <h2>Blogs ({totalPosts} total)</h2>
            <Form inline onSubmit={handleSearch} className="search-form">
              <Form.Control
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
              />
              <Button type="submit" variant="outline-primary">Search</Button>
            </Form>
          </div>

          {loading && <div role="alert" aria-busy="true">Loading...</div>}
          {error && <div role="alert" className="alert alert-danger">{error}</div>}
          {!loading && !error && posts.length === 0 && <p>No posts found.</p>}

          <Row>
            {posts.map((post) => (
              <Col key={post.slug} sm={12} md={6} lg={4} className="card-container">
                <Card>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-decoration-none"
                    aria-label={`Read ${post.title}`}
                  >
                    <Card.Img
                      variant="top"
                      src={`${import.meta.env.VITE_API_URL}/files/media/thumbnails/${post.postid}.png`}
                      alt={post.title}
                      className="card-img"
                    />
                    <Card.Body className="card-body">
                      <Card.Title className="card-title">{post.title}</Card.Title>
                      <Card.Text className="text-muted">
                        Posted on{" "}
                        {new Date(post.publicationdate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Card.Text>
                      <Card.Text>{post.content}</Card.Text>
                      <Button variant="link" className="p-0">
                        Read more...
                      </Button>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Item>{currentPage}</Pagination.Item>
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogList;
