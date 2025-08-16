import React from 'react';

const Input = ({ 
  placeholder, 
  value, 
  onChange, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition';
  
  return (
    <input 
      className={`${baseClasses} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default Input;
