import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { AuthContext } from "../context/authContext";
import defaultImage from "../images/Twitter-wall-of-love.png";
import updateIcon from "../images/setting-icon.png"; 
import deleteIcon from "../images/delete-icon.png"; 
import shareIcon from "../images/share-icon.png";
import embedCodeIcon from "../images/embed-code-icon.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [walls, setWalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const logoUrl = user?.profile_pic || defaultImage;

  useEffect(() => {
    const fetchWalls = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        const response = await api.get(API_ENDPOINTS.GET_ALL_WALLS);
        const wallData = Array.isArray(response.data) ? response.data : [];
        setWalls(wallData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load walls:", err);
        setError("Failed to load your walls. Please try again.");
        setLoading(false);
      }
    };
    fetchWalls();
  }, [user, navigate]);

  const handleDeleteWall = async (wallId) => {
    if (!window.confirm("Are you sure you want to delete this wall?")) return;
    try {
      await api.delete(API_ENDPOINTS.DELETE_WALL(wallId));
      setWalls(walls.filter((wall) => wall.id !== wallId));
    } catch (err) {
      setError("Failed to delete wall. Please try again.");
    }
  };

  const handleShareWall = async (wallId) => {
    const response = await api.get(
        API_ENDPOINTS.GENERATE_SHARABLE_LINK(wallId)
    );
    navigator.clipboard.writeText(response.data.link);
    alert("Sharable link copied to clipboard!");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGenerateEmbedCode = async (wallId) => {
          try {
              const response = await api.get(
                  API_ENDPOINTS.GET_EMBED_CODE(wallId)
              );
              navigator.clipboard.writeText(response.data.embedCode);
          } catch (err) {
              setError("Failed to generate embed code");
          }
      };

  const handleWallClick = (wallId) => {
    navigate(`/walls/${wallId}/tweets`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-full p-6 flex flex-col justify-between">
        <div>
          {/* User Profile */}
          <div
            className="flex items-center space-x-3 mb-8 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={logoUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
            <span className="text-lg font-semibold text-gray-800">
              {user?.name || "User"}
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            <button
              className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              onClick={() => navigate("/dashboard")}
            >
              Walls
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => navigate("/profile")}
            >
              Settings
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => navigate("/create-wall")}
            >
              Create Wall
            </button>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Your Walls</h1>
          </div>

          {/* Walls Table */}
          {loading ? (
            <p className="text-center text-gray-600">Loading your walls...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : walls.length === 0 ? (
            <p className="text-center text-gray-600">
              No walls yet. Create one to get started!
            </p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-4 text-left">Logo</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {walls.map((wall) => (
                    <tr
                      key={wall.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* Clickable Logo */}
                      <td
                        className="py-4 px-4 cursor-pointer"
                        onClick={() => handleWallClick(wall.id)}
                      >
                        <img
                          src={wall?.logo || defaultImage}
                          alt={wall.title}
                          className="w-10 h-10 rounded-full border-2 border-gray-300"
                        />
                      </td>

                      {/* Clickable Title */}
                      <td
                        className="py-4 px-4 cursor-pointer"
                        onClick={() => handleWallClick(wall.id)}
                      >
                        <span className="text-lg font-semibold text-gray-800">
                          {wall.title || "Untitled Wall"}
                        </span>
                      </td>

                      {/* Action Images */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end space-x-4">
                          <img
                            src={updateIcon}
                            alt="Update"
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/walls/${wall.id}/edit`);
                            }}
                          />
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWall(wall.id);
                            }}
                          />
                          <img
                            src={shareIcon}
                            alt="Share"
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareWall(wall.id);
                            }}
                          />
                           <img
                            src={embedCodeIcon}
                            alt="Share"
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateEmbedCode(wall.id);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;