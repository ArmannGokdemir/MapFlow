import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200 text-gray-600',
    success: 'px-3 py-1 bg-green-500 text-white rounded-lg shadow-lg text-sm font-bold',
    info: 'px-2 py-1 text-[11px] rounded-full bg-sky-50 text-sky-700 border border-sky-200',
    link: 'text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
  };
  
  return (
    <span className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
