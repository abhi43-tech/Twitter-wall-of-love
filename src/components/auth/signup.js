import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await signup(name, email, password, profilePic);
      setSuccessMessage('Signup successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 1000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Profile picture must be less than 2 MB');
      return;
    }

    if (file.type !== 'image/png') {
      setError('Profile picture must be a PNG file');
      return;
    }

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center border border-red-400">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="bg-green-100 text-green-600 p-3 rounded mb-4 text-center border border-green-400">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              minLength={8}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Profile Picture (PNG, max 2MB)
            </label>
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="w-full p-2 border rounded focus:outline-none"
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="h-20 w-20 object-cover rounded-full mx-auto border border-gray-300"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-center justify-between">
          <a
            href="/login"
            className="text-blue-500 hover:underline"
          >
            Already have an account?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;