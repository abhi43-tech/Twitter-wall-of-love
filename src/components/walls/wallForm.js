import React, { useState } from 'react';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/apiEndpoints';

const WallForm = ({ onWallCreated, wall }) => {
  const [title, setTitle] = useState(wall?.title || '');
  const [description, setDescription] = useState(wall?.description || '');
  const [logo, setLogo] = useState(null);
  const [isPublic, setIsPublic] = useState(wall?.is_public ?? true);
  const [socialLinks, setSocialLinks] = useState(wall?.social_links || []);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const invalidLinks = socialLinks.filter(
        (link) => !link.platform || !link.url
      );
      if (invalidLinks.length > 0) {
        throw new Error('All social links must have a platform and URL');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('is_public', isPublic);
      if (logo) formData.append('image', logo);
      if (socialLinks.length > 0) {
        formData.append('social_links', JSON.stringify(socialLinks));
      }

      const url = wall
        ? API_ENDPOINTS.UPDATE_WALL(wall.id)
        : API_ENDPOINTS.CREATE_WALL;
      const method = wall ? 'put' : 'post';
      const response = await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onWallCreated) onWallCreated(response.data);
      setTitle('');
      setDescription('');
      setLogo(null);
      setIsPublic(true);
      setSocialLinks([]);
    } catch (err) {
      setError('Failed to save wall');
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'twitter', url: '' }]);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
    console.log(socialLinks)
  };

  const handleRemoveSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">{wall ? 'Edit Wall' : 'Create a New Wall'}</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Logo (PNG, max 2MB)</label>
          <input
            type="file"
            accept="image/png"
            onChange={(e) => setLogo(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Public</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2"
          />
          <span>Make this wall public</span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Social Links</label>
          {socialLinks.map((link, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={link.platform}
                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
              </select>
              <input
                type="text"
                value={link.link}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="URL"
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="text-blue-500 hover:underline"
          >
            Add Social Link
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {wall ? 'Update Wall' : 'Create Wall'}
        </button>
      </form>
    </div>
  );
};

export default WallForm;