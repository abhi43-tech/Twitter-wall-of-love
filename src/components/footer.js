import React from 'react';

const Footer = ({ socialLinks }) => {
  return (
    <div className="bg-gray-100 p-6 text-center">
      <div className="flex justify-center space-x-4">
        {socialLinks?.map((link) => (
          <a
            key={link.id}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;