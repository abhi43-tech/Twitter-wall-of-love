import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { AuthContext } from "../context/authContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [walls, setWalls] = useState([]);
  const [filteredWalls, setFilteredWalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useContext(AuthContext);
  const logoUrl = user?.profile_pic ?? "https://www.pngmart.com/files/23/Zoro-PNG-Image.png";

  useEffect(() => {
    const fetchWalls = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.GET_ALL_WALLS);
        const wallData = Array.isArray(response.data) ? response.data : [];
        setWalls(wallData);
        setFilteredWalls(wallData); // Initialize filtered list with all walls
      } catch (err) {
        console.error("Failed to load walls:", err);
      }
    };
    fetchWalls();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = walls.filter((wall) => {
      const titleMatch = wall.title?.toLowerCase().includes(query);
      // If wall data includes a user name (e.g., wall.user?.name), uncomment and adjust:
      // const userMatch = wall.user?.name?.toLowerCase().includes(query);
      // return titleMatch || userMatch;
      return titleMatch;
    });
    setFilteredWalls(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full" />
          <h2 className="text-2xl font-bold">{user?.name}</h2>
        </div>

        {/* Search Bar in Header */}
        <div className="flex-1 max-w-md mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by wall title..."
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/create-wall")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Wall
          </button>
          <button
            onClick={() => navigate("/profile")}
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
      {filteredWalls.length === 0 ? (
        <p className="text-center text-gray-600">No walls found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWalls.map((wall) => (
            <div
              key={wall.id}
              className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/walls/${wall.id}/tweets`)}
            >
              <div className="flex items-center">
                <img
                  src={wall.logo || "/placeholder.jpg"}
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
        </div>
      )}
    </div>
  );
};

export default Dashboard;