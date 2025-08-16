import React from 'react';

const Card = ({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: 'bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm',
    solid: 'bg-white border border-gray-200 rounded-2xl shadow-sm',
    glass: 'bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-sm'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
