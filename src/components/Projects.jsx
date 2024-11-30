import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link, useNavigate } from "react-router-dom";
import gfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import "./css/Pages.css";
import "./css/BlogList.css";

// Component to display a single blog post
const ProjectTool = () => {
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProject = async () => {
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
          navigate("/projects");
          return;
        }
        const data = await response.json();
        setProject(data[0]);
      } catch (error) {
        console.error("Error loading post:", error);
        
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProject();
  }, [slug, navigate]);

  return (
    <div className="master-blog">
      <div className="pages-individual">
        {loading ? (
          <div className="loading-placeholder"></div> // Show while loading
        ) : (
          <article className="blog">
            <div className="header-container">
              <h1 className="blog-header">{project.title}</h1>
              <a className="blog-meta">Posted by {project.author} on {new Date(project.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</a>
            </div>
            <ReactMarkdown
              children={project.content}
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
const ProjectList = () => {
  const [projects, setProjects] = useState([]); 
  const [searchQuery, setSearchQuery ] = useState("");

  const fetchProject = async (query = "") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bloglist${query ? `?query=${encodeURIComponent(query)}` : ''}`);
      const data = await response.json();
      console.log(data);
      setProjects(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleSearch = () => {
    fetchProject(searchQuery);
  };

  return (
    <div className="pages-custom">
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
        {projects.map((project) => (
          <article key={project.postid} className="articleclass">
            <Link
              to={`/projects/${project.postid}`}
              aria-label={`Read more about ${project.title}`}
            >
              <div><p>{project.catagory}</p></div>
              <h4>{project.title}</h4>
              <div className="meta">
                <p>
                  Posted on {new Date(project.publicationdate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <img src={`${import.meta.env.VITE_API_URL}/images/${project.postid}.jpg`} alt={project.title} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

// Main Blog component that handles routing
const Projects = () => {
  const { slug } = useParams();

  return slug ? <ProjectTool /> : <ProjectList />;
};

export default Projects;
