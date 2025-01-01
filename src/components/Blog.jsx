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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/data`, {
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
        
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPost();
  }, [slug, navigate]);

  return (
    <div className="container">
      <div className="master-blog">
        <div className="pages-individual">
          {loading ? (
            <div className="loading-placeholder"></div> // Show while loading
          ) : (
            <article className="blog">
              <div className="header-container">
                <h1 className="blog-header">{post.title}</h1>
                <a className="blog-meta">Posted by {post.author} on {new Date(post.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</a>
              </div>
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
    </div>
  );
};

// Component to display the list of blog posts
const BlogList = () => {
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
      <div className="holder">
        <div className="search-container">
          <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Search with title..." 
              className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>
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
                    Posted on {new Date(post.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <img src={`${import.meta.env.VITE_API_URL}/images/thumbnails/${post.postid}.jpg`} alt={post.title} />
              </Link>
            </article>
          ))}
        </div>
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
