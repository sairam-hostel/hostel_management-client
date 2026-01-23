import React from 'react';
import CustomDropdown from './CustomDropdown';

/**
 * SelectField Component
 * 
 * A form field wrapper around the CustomDropdown component, providing a standard label and layout.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.label - Label text for the select field.
 * @param {string} props.name - Name attribute, used for the synthetic event.
 * @param {any} props.value - Currently selected value.
 * @param {Function} props.onChange - Callback function, receives a synthetic event { target: { name, value } }.
 * @param {Array<string|{label: string, value: any}>} props.options - List of options.
 * @param {boolean} [props.required=false] - Whether the field is required.
 * @param {string} [props.className=""] - Additional CSS classes.
 * @param {boolean} [props.searchable=false] - Whether the dropdown should include a search input.
 * @returns {JSX.Element} The rendered SelectField component.
 */
const SelectField = ({ label, name, value, onChange, options, required = false, className = "", searchable = false, ...props }) => {
  
  // Convert simple string options to { label, value } format
  const formattedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) return opt;
    return { label: opt, value: opt };
  });

  const handleDropdownChange = (newValue) => {
    // Create synthetic event for compatibility with form handlers
    const syntheticEvent = {
      target: {
        name: name,
        value: newValue
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <CustomDropdown
        options={formattedOptions}
        value={value}
        onChange={handleDropdownChange}
        placeholder={`Select ${label}`}
        searchable={searchable}
      />
    </div>
  );
};

export default SelectField;
