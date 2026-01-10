import React from 'react';
import logo from '../app/auth/Sairam-instuition.png';

/**
 * Logo Component
 * 
 * Displays the application logo.
 * 
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes for the image.
 * @returns {JSX.Element} The rendered Logo component.
 */
const Logo = ({ className, ...props }) => {
  return (
    <img 
      src={logo} 
      alt="Sairam Logo" 
      className={className}
      {...props} 
    />
  );
};

export default Logo;
