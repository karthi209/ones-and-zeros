import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import gfm from "remark-gfm";
import { Container, Row, Col, Spinner, Alert, Card } from "react-bootstrap";
import CodeBlock from "./CodeBlock";
import MapComponent from "./MapComponent";
import "../css/BlogPost.css"; // Import the CSS file

const extractMapData = (markdownContent) => {
  const mapRegex = /\[map center="([^"]+)" zoom="([^"]+)" gisdataurl="([^"]+)"\]/g;
  const matches = [];
  let match;

  while ((match = mapRegex.exec(markdownContent)) !== null) {
    matches.push({
      mapcenter: match[1].split(',').map(parseFloat),
      zoom: parseInt(match[2], 10),
      gisdataurl: match[3],
    });
  }

  return matches.length > 0 ? matches : null;
};

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const { content } = post || {}; // Safely destructure content in case post is null
  const mapsData = content ? extractMapData(content) : null;

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: slug,
          }),
        });

        if (!response.ok) {
          throw new Error("Post not found");
        }

        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        setError(error.message || "Failed to load post");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const renderContent = () => {
    if (!content) return null;

    const parts = content.split("[MAP]");

    return parts.map((part, index) => {
      if (index === 0) {
        return (
          <div key={index} className="blog-post-content" style={{ marginTop: '50px' }}>
            <ReactMarkdown
              children={part.replace(/\[map[^\]]+\]/g, "")}
              remarkPlugins={[gfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, "")}
                      />
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
            {mapsData && mapsData.map((mapData, i) => (
              <MapComponent
                key={i}
                mapcenter={mapData.mapcenter}
                zoom={mapData.zoom}
                gisdataurl={mapData.gisdataurl}
                className="blog-post-map"
              />
            ))}
          </div>
        );
      }
      return (
        <div key={index}>
          <ReactMarkdown children={part} remarkPlugins={[gfm]} />
        </div>
      );
    });
  };

  return (
    <Container className="blog-post-container">
      <Row>
        <Col>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="alert-container">
              <Alert variant="danger">{error}</Alert>
            </div>
          ) : post ? (
            <Card className="mb-4">
              <Card.Body className="mobile-view" style={{ padding: '5% 10%' }}>
                <Card.Title className="card-title" style={{ fontSize: '40px', marginBottom: '20px' }}>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted card-subtitle" style={{ fontSize: '18px' }}>
                  Posted by {post.author} on{" "}
                  {new Date(post.publicationdate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Card.Subtitle>
                {renderContent()}
              </Card.Body>
            </Card>
          ) : (
            <div className="alert-container">
              <Alert variant="danger">Post not found.</Alert>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPost;
