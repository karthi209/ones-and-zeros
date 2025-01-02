// components/Blog.js
import { useParams } from "react-router-dom";
import BlogPost from "./BlogPost";
import BlogList from "./BlogList";

const Blog = () => {
  const { slug } = useParams();

  return slug ? <BlogPost /> : <BlogList />;
};

export default Blog;