import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDarkAtom } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value }) => {

  const codeStyle = {
    fontSize: '15px', // Adjust the font size here
    padding: '10px',  // Optional: Add padding for better spacing
    borderRadius: '5px', // Optional: Add border radius for rounded corners
  };

  return (
    <SyntaxHighlighter language={language} style={solarizedDarkAtom} customStyle={codeStyle}>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
