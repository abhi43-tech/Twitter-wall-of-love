import React, { useState } from 'react';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/apiEndpoints';

const TweetForm = ({ wallId, onTweetAdded }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_TWEET(wallId), { url });
      if (onTweetAdded) onTweetAdded(response.data);
      setUrl('');
    } catch (err) {
      setError('Failed to add tweet');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Add a Tweet</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tweet URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://twitter.com/username/status/123456789"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Tweet
        </button>
      </form>
    </div>
  );
};

export default TweetForm;