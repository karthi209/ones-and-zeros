import React from 'react'
import './Mapchart.css';

function ToolSelect() {

    const { toolslug } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchPost = async () => {
        setLoading(true); // Start loading
        try {
          const response = await fetch(`/projects/${toolslug}.md`);
          if (!response.ok) {
            navigate('/projects');
            return;
          }
          const text = await response.text();
          setPost(text);
        } catch (error) {
          console.error('Error loading post:', error);
          navigate('/projects');
        } finally {
          setLoading(false); // End loading
        }
      };
    
      fetchPost();
    }, [toolslug, navigate]);


    return (
        <div className="pages-custom">
        <p>Map page is under-construction</p>
    </div>
    )
}

const MapChart = () => {
    const { toolslug } = useParams();
  
    return toolslug ? <ToolSelect /> : <ToolSelect />;
  };

export default MapChart;