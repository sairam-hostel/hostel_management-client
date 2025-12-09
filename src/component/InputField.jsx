import React from 'react';

const InputField = ({ label, name, type = "text", value, onChange, required = false, className = "", placeholder, ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-full transition-shadow placeholder:text-gray-400"
      required={required}
      {...props}
    />
  </div>
);

export default InputField;
