import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import gfm from "remark-gfm";
import MapComponent from "./MapComponent";
import CodeBlock from "./CodeBlock";

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
            slug: slug
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

  const renderers = {
    text: (text) => {
      if (post?.hasMap && text.includes("[MAP]")) {
        return (
          <>
            {text.split("[MAP]").map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && (
                  <MapComponent
                    mapCenter={post.mapCenter || [0, 0]}
                    zoom={post.zoom || 2}
                    gisDataUrl={post.gisDataUrl || ""}
                  />
                )}
              </React.Fragment>
            ))}
          </>
        );
      }
      return text;
    },
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
              {post.content ? (
                <ReactMarkdown
                  children={post.content}
                  remarkPlugins={[gfm]}
                  components={{
                    ...renderers,
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return inline ? (
                        <code {...props}>{children}</code>
                      ) : (
                        <CodeBlock
                          language={match ? match[1] : ""}
                          value={String(children).replace(/\n$/, "")}
                        />
                      );
                    },
                  }}
                />
              ) : (
                <p>No content available for this post.</p>
              )}
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