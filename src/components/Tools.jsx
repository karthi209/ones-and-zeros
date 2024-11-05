import React from 'react';
import { useParams } from 'react-router-dom';

const Tool = () => {
  const { slug } = useParams();
  
  // Tools data (can also be imported from another file)
  const tools = [
    { id: 1, name: "Tool 1", slug: "tool-1", content: "Content for Tool 1..." },
    { id: 2, name: "Tool 2", slug: "tool-2", content: "Content for Tool 2..." },
  ];

  // Find the tool by slug
  const tool = tools.find(t => t.slug === slug);

  // If tool not found, you can handle it appropriately
  if (!tool) {
    return <h2>Tool not found</h2>;
  }

  return (
    <div>
      <h1>{tool.name}</h1>
      <p>{tool.content}</p>
      {/* Additional tool content here */}
    </div>
  );
};

export default Tool;
