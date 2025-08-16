import React from 'react';

const Checkbox = ({ 
  checked, 
  onChange, 
  label,
  className = '',
  ...props 
}) => {
  return (
    <label className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-sky-600 rounded-full" />
        <span className="font-medium">{label}</span>
      </div>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        {...props}
      />
    </label>
  );
};

export default Checkbox;
