import { Container, Row, Col, Alert } from "react-bootstrap";

const Projects = () => {
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Projects</h2>
        </Col>
      </Row>

      {/* Under Construction Banner */}
      <Row>
        <Col className="text-center">
          <Alert variant="warning">
            <h4>Under Construction</h4>
            <p>This page is currently under construction. Please check back later.</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Projects;
