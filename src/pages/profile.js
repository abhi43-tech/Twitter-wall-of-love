import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';


const Profile = () => {
  const { user, updateUser, deleteUser, generateApiToken } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState(user?.profile_pic || '');
  const [apiToken, setApiToken] = useState(user?.api_token || '');
  const [error, setError] = useState('');
  const [updateStatus, setStatus] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(name, email, profilePic);
      setStatus('Profile updated successfully');
    } catch (err) {
      setStatus('Failed to update profile');
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Profile - User loaded:', user);
      setName(user.name || '');
      setEmail(user.email || '');
      setApiToken(user.api_token || '');
    }
  }, [user]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await deleteUser();
        window.location.href = '/';
      } catch (err) {
        setError('Failed to delete account');
      }
    }
  };

  const handleGenerateApiToken = async () => {
    try {
      const response = await generateApiToken();
      setApiToken(response.apiToken);
    } catch (err) {
      setError('Failed to generate API token');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError('Profile picture must be less than 2 MB');
      return;
    }
    if (file && file.type !== 'image/png') {
      setError('Profile picture must be a PNG file');
      return;
    }
    setProfilePic(file);
  };

  if (user == null) return <div className="text-center p-6">Please log in to view your profile.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      {updateStatus && <p className="text-red-500 mb-4">{updateStatus}</p>}
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Picture (PNG, max 2MB)</label>
          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">API Token</h3>
        {apiToken ? (
          <p className="mb-4">Your API Token: <code>{apiToken}</code></p>
        ) : (
          <button
            onClick={handleGenerateApiToken}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Generate API Token
          </button>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Danger Zone</h3>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;