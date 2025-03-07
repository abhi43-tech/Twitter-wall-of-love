import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Twitter/X Wall of Love</h1>
        <p className="text-lg mb-6">
          Create and share walls of your favorite tweets!
        </p>
        {user ? (
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
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