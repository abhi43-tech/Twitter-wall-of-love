import React from 'react';

const Header = ({ title, logo }) => {
  return (
    <div className="bg-gray-100 p-6 text-center">
      {logo && (
        <img src={logo} alt="Wall Logo" className="mx-auto h-16 w-auto mb-4" />
      )}
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default Header;