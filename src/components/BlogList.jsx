import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      // Fixed API endpoint path to match backend
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
    <div className="container">
      <div className="holder">
        <div className="blog-bar">
          <h2>Blogs ({totalPosts} total)</h2>
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="search-input"
              aria-label="Search posts"
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

        {!loading && !error && posts.length === 0 && (
          <p>No posts found.</p>
        )}

        <section className="column">
          <div>
            {posts.map((post) => (
              <article key={post.slug} className="blog-recents">
                <Link
                  to={`/blog/${post.slug}`}
                  className="blog-link"
                  aria-label={`Read ${post.title}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="test-recents">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/files/media/thumbnails/${post.postid}.png`}
                    alt={post.title}
                    className="post-image"
                    style={{
                      width: '200px', // Adjust width as needed
                      height: 'auto', // Maintain aspect ratio
                      borderRadius: '4px', // Optional: Add rounded corners for a softer look
                      marginBottom: '10px', // Add spacing between image and text
                      marginTop: '20px',
                      marginRight: '20px'
                    }}
                  />
                  <div>
                    <h3 className="mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-0">
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
                    <span className="text-sm mt-2">Read More...</span>
                  </div>
                  </div>
                  {/* Add an image at the start of the post */}

                </Link>
              </article>
            ))}
          </div>
        </section>


        {totalPages > 1 && (
          <div className="pagination">
            {/* "Previous" Button */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="pagination-button"
              disabled={currentPage === 1} // Disable if on the first page
            >
              Previous
            </button>

            {/* Page Info */}
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>

            {/* "Next" Button */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="pagination-button"
              disabled={currentPage === totalPages} // Disable if on the last page
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;