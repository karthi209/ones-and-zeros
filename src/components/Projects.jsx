import React from "react";
import { Link } from 'react-router-dom';
import "./css/Pages.css";

function Projects() {

  const tools = [
    { id: 1, name: "Tool 1", slug: "tool-1" },
    { id: 2, name: "Tool 2", slug: "tool-2" },
  ];

  return (
    <div>
      <h1>Projects</h1>
      <h2>Tools</h2>
      <ul>
        {tools.map(tool => (
          <li key={tool.id}>
            <Link to={`/projects/${tool.slug}`}>{tool.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
