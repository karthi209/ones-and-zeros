import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Projects = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bloglist${
          query ? `?query=${encodeURIComponent(query)}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Handle the paginated response
      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setError(error.message || "Error loading posts");
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    fetchPosts(searchQuery);
  };

  const sortedPosts = posts
    .sort((a, b) => new Date(b.publicationdate) - new Date(a.publicationdate))
    .slice(0, 6); // Take the latest six posts

  return (
    <div className="container">
      <div className="holder">
        <div className="blog-bar">
          <h2>Projects {totalPosts > 0 && `(${totalPosts})`}</h2>
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search with title..."
              className="search-input"
              aria-label="Search projects"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        {loading && (
          <div role="alert" aria-busy="true">
            Loading...
          </div>
        )}
        
        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && sortedPosts.length === 0 && (
          <p>No projects found.</p>
        )}

        <section className="column">
          <div>
            {sortedPosts.map((post) => (
              <Link 
                key={post.slug}
                to={`/blog/${post.slug}`} 
                aria-label={`Read more about ${post.title}`} 
                style={{ textDecoration: 'none' }}
              >
                <article className="blog-recents">
                  <h4 style={{ marginBottom: "5px" }}>{post.title}</h4>
                  <p style={{ fontSize: "13px", marginTop: "0px", color: "gray" }}>
                    Posted on{" "}
                    {new Date(post.publicationdate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="post-content-preview">
                    {post.content}
                  </div>
                  <span style={{ fontSize: "13px", marginTop: "0px" }}>
                    Read More..
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;