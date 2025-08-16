import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 focus:ring-gray-400',
    primary: 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-400'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
