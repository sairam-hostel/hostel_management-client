import React from 'react';
import logo from '../app/auth/Sairam-instuition.png';

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
