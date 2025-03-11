import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, newPassword);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Reset Password
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleResetSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Token
                        </label>
                        <input
                            type="string"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <label className="block text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
  );
};

export default ResetPassword;