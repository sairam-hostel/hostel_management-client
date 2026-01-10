import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

/**
 * CustomDropdown Component
 * 
 * A customizable dropdown component with support for searching and different layouts.
 * 
 * @component
 * @param {Object} props
 * @param {Array<{label: string, value: any}>} props.options - List of options for the dropdown.
 * @param {any} props.value - The currently selected value.
 * @param {Function} props.onChange - Callback function when an option is selected. Returns the value.
 * @param {string} [props.placeholder="Select..."] - Placeholder text when no value is selected.
 * @param {React.ElementType} [props.icon] - Optional icon component to display in the trigger button.
 * @param {string} [props.className=""] - Additional CSS classes.
 * @param {boolean} [props.dropUp=false] - Whether the dropdown should open upwards.
 * @param {boolean} [props.searchable=false] - Whether to show a search input within the dropdown menu.
 * @returns {JSX.Element} The rendered CustomDropdown component.
 */
const CustomDropdown = ({ options, value, onChange, placeholder = "Select...", icon: Icon, className = "", dropUp = false, searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || value || placeholder;
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
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
        <div className={`
          absolute left-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100
          ${dropUp ? 'bottom-full mb-2 origin-bottom-left' : 'top-full mt-2 origin-top-left'}
        `}>
          {searchable && (
            <div className="p-2 border-b border-gray-50 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 placeholder-gray-400"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="p-1 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center justify-start gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left
                  ${value === option.value 
                    ? 'bg-purple-50 text-purple-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="flex-1">{option.label}</span>
                {value === option.value && <Check size={14} className="text-purple-600 ml-auto shrink-0" />}
              </button>
            ))) : (
              <div className="p-3 text-center text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
