import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"; // Using react-bootstrap for layout
import BlogPost from "./BlogPost";
import BlogList from "./BlogList";

const Blog = () => {
  const { slug } = useParams();

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          {slug ? <BlogPost /> : <BlogList />}
        </Col>
      </Row>
    </Container>
  );
};

export default Blog;
