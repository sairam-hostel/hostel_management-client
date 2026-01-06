import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder = "Select...", icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || value || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full gap-3 px-4 py-2.5 
          bg-white border text-sm font-medium rounded-xl shadow-sm transition-all duration-200
          ${isOpen 
            ? 'border-purple-500 ring-2 ring-purple-100 text-purple-700' 
            : 'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className={isOpen ? 'text-purple-500' : 'text-gray-400'} />}
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-500' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
                  ${value === option.value 
                    ? 'bg-purple-50 text-purple-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={14} className="text-purple-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
