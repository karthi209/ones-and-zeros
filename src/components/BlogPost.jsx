import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import MapComponent from "./MapComponent";

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

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
    const parts = post.content.split("[MAP]");
    
    return parts.map((part, index) => {
      if (index === 0) {
        // First part: render markdown and the map
        return (
          <div key={index}>
            <ReactMarkdown>{part}</ReactMarkdown>
            {post?.hasmap && (
              <MapComponent
                mapcenter={post.mapcenter}
                zoom={post.zoom}
                gisdataurl={post.gisdataurl}
              />
            )}
          </div>
        );
      }
      // For the other parts, just render markdown (after a [MAP] tag)
      return <div key={index}><ReactMarkdown>{part}</ReactMarkdown></div>;
    });
  };
  

  return (
    <div className="container">
      <div className="master-blog">
        <div className="pages-individual">
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
              {renderContent()} {/* Call renderContent here instead of ReactMarkdown */}
            </article>
          ) : (
            <div className="error-message">Post not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;