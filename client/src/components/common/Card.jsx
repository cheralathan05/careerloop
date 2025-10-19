// client/src/components/common/Card.jsx

import React from 'react';

const Card = ({ 
  title, 
  description, 
  children, 
  className = '', 
  // Enhancement 1: Allow consumers to specify the HTML heading tag (e.g., 'h2', 'h3')
  titleAs = 'h3', 
  ...rest 
}) => {
  
  // Dynamically create the Title component based on the prop
  const TitleTag = titleAs; 
  
  return (
    // Enhancement 2: Default styling with slightly better depth
    <div 
      className={`p-6 bg-white shadow-xl rounded-xl border border-gray-100 ${className}`}
      {...rest}
    >
      {/* Ensure the card title is rendered as the correct semantic element
      */}
      {title && (
        <TitleTag className="text-xl font-bold mb-3 text-gray-800">
          {title}
        </TitleTag>
      )}
      
      {description && (
        <p className="text-gray-500 mb-4 text-sm">
          {description}
        </p>
      )}
      
      {/* This is where the primary content (AuthForms, Dashboard widgets, etc.) will go */}
      {children}
    </div>
  );
};

export default Card;