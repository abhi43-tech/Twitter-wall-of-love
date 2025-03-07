import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Adjust path as needed
import { API_ENDPOINTS } from '../services/apiEndpoints';

const Dashboard = () => {
  const navigate = useNavigate();
  const [walls, setWalls] = useState([]);
  const logoUrl = '/path-to-logo.png';

  useEffect(() => {
    const fetchWalls = async () => {
      const response = await api.get(API_ENDPOINTS.GET_ALL_WALLS); // Adjust endpoint
      setWalls(response.data);
    };
    fetchWalls();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src={logoUrl} alt="Logo" className="w-10 h-10 mr-2 rounded-full" />
          <h2 className="text-2xl font-bold">Abhi's Wall</h2>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/create-wall')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Wall
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Updated Wall Cards in Grid Layout */}
      {walls.length === 0 ? (
                    <p>No walls created yet.</p>
                ) :
      (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {walls.map((wall) => (
          <div
            key={wall.id}
            className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200"
            onClick={() => navigate(`/walls/${wall.id}/tweets`)}
          >
            <div className="flex items-center">
              <img
                src={wall.logo || '/placeholder.jpg'}
                alt={wall.title}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold text-gray-800">{wall.title}</p>
                <p className="text-gray-600">{wall.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default Dashboard;