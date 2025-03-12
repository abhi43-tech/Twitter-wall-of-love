import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 md:px-6">
      <div className="text-center p-6 max-w-lg">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Twitter/X Wall of Love
        </h1>
        <p className="text-base md:text-lg mb-6">
          Create and share walls of your favorite tweets!
        </p>
        {user ? (
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition block w-full md:w-auto"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4">
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition w-full md:w-auto text-center"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition w-full md:w-auto text-center"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
