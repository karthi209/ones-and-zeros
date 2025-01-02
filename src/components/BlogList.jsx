import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bloglist${
          query ? `?query=${encodeURIComponent(query)}` : ""
        }`
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError("Error loading posts");
    } finally {
      setLoading(false);
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search with title..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <div className="blogposts">
          {posts.map((post) => (
            <article key={post.postid} className="articleclass">
              <Link
                to={`/blog/${post.slug}`}
                aria-label={`Read more about ${post.title}`}
              >
                <div>
                  <p>{post.catagory}</p>
                </div>
                <h4>{post.title}</h4>
                <div className="meta">
                  <p>
                    Posted on{" "}
                    {new Date(post.publicationdate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <img
                  src={`${import.meta.env.VITE_API_URL}/files/thumbnails/${post.postid}.jpg`}
                  alt={post.title}
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
