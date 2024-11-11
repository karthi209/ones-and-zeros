import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({ 
  category = 'Typography',
  title = 'the best ink trap typefaces for websites',
  description = 'A look at type that features prominent cuts or tapering into the type and a variety of recommendations you can use in your designs.',
  icon = '🔤'
}) => {
  return (
    <article className="article-card">
      <div className="icon-container">
        <span className="icon" role="img" aria-label="category icon">
          {icon}
        </span>
      </div>

      <div>
        <div className="category">
          {category}
        </div>

        <h2 className="title">
          {title}
        </h2>

        <p className="description">
          {description}
        </p>
      </div>
    </article>
  );
};

export default ArticleCard;