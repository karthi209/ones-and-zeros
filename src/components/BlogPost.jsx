import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import MapComponent from "./MapComponent";

const extractMapData = (markdownContent) => {
  // Regular expression to match multiple map syntax in markdown
  const mapRegex = /\[map center="([^"]+)" zoom="([^"]+)" gisdataurl="([^"]+)"\]/g;
  const matches = [];
  let match;

  while ((match = mapRegex.exec(markdownContent)) !== null) {
    matches.push({
      mapcenter: match[1].split(',').map(parseFloat), // Convert to [lat, lon]
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
  
  // Extract map data from the content
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
    if (!content) return null; // If content is not available, return nothing

    const parts = content.split("[MAP]");

    return parts.map((part, index) => {
      if (index === 0) {
        // First part: render markdown and the maps
        return (
          <div key={index}>
            <ReactMarkdown
              children={part.replace(/\[map[^\]]+\]/g, "")} // Clean up the map tags from the markdown
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
              />
            ))}
          </div>
        );
      }
      // For other parts, just render markdown (after a [MAP] tag)
      return (
        <div key={index}>
          <ReactMarkdown children={part} remarkPlugins={[gfm]} />
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="master-blog">
          {loading ? (
            <div className="loading-placeholder"></div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : post ? (
            <article className="blog">
              <div className="header-container">
                <h1 className="blog-header">{post.title}</h1>
                <a className="blog-meta">
                  Posted by {post.author} on{" "}
                  {new Date(post.publicationdate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </a>
              </div>
              {renderContent()}{" "}
              {/* Call renderContent here instead of ReactMarkdown */}
            </article>
          ) : (
            <div className="error-message">Post not found.</div>
          )}
        </div>
      </div>
  );
};

export default BlogPost;
