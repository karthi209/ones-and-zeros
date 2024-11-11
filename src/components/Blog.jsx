import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link, useNavigate } from "react-router-dom";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import "./css/Pages.css";
import "./css/BlogList.css";

// Component to display a single blog post
const BlogPost = () => {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchPost = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:3000/data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            integerValue: parseInt(slug, 10)
          })
        });
        if (!response.ok) {
          navigate("/blog");
          return;
        }
        const data = await response.json();
        setPost(data[0]);
      } catch (error) {
        console.error("Error loading post:", error);
        navigate("/blog");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPost();
  }, [slug, navigate]);

  return (
    <div className="master-blog">
      <div className="pages-individual">
        {loading ? (
          <div className="loading-placeholder"></div> // Show while loading
        ) : (
          <article className="blog">
            <h1>{post.title}</h1>
            <p>By {post.author} on {new Date(post.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <ReactMarkdown
              children={post.content}
              remarkPlugins={[gfm]}
              components={{
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
          </article>
        )}
      </div>
    </div>
  );
};

// Component to display the list of blog posts
const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bloglist`);
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="pages-custom">
      <div className="blogposts">
        {posts.map((post) => (
          <article key={post.postid} className="articleclass">
            <Link
              to={`/blog/${post.postid}`}
              aria-label={`Read more about ${post.title}`}
            >
              <div><p>{post.catagory}</p></div>
              <h4>{post.title}</h4>
              <div className="meta">
                <p>
                  Posted on {new Date(post.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })} | By{" "}
                  {post.author}{" "}
                </p>
              </div>
              {/* <img src={`http://localhost:3000/images/${post.postid}.jpg`} alt={post.title} /> */}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

// Main Blog component that handles routing
const Blog = () => {
  const { slug } = useParams();

  return slug ? <BlogPost /> : <BlogList />;
};

export default Blog;
