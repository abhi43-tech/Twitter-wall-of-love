import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import defaultImage from "../images/Twitter-wall-of-love.png";

const WallOverview = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalWalls: 0,
    publicWalls: 0,
    privateWalls: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logoUrl = user?.profile_pic || defaultImage;

  useEffect(() => {
    const fetchWallStats = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        const response = await api.get(API_ENDPOINTS.GET_ALL_WALLS);
        const walls = Array.isArray(response.data) ? response.data : [];
        
        const statsData = {
          totalWalls: walls.length,
          publicWalls: walls.filter(wall => wall.is_public).length,
          privateWalls: walls.filter(wall => !wall.is_public).length,
        };
        
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load wall stats:", err);
        setError("Failed to load wall statistics. Please try again.");
        setLoading(false);
      }
    };
    fetchWallStats();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar (Reusing same sidebar as Dashboard) */}
      <aside
        className={`w-64 bg-white shadow-md fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-64 md:h-full p-6 flex flex-col justify-between`}
      >
        <div>
          <div
            className="flex items-center space-x-3 mb-6 md:mb-8 cursor-pointer"
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

          <nav className="space-y-4">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => {
                navigate("/profile");
                setIsSidebarOpen(false);
              }}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              onClick={() => {
                navigate("/wall-overview");
                setIsSidebarOpen(false);
              }}
            >
              Overview
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => {
                navigate("/dashboard");
                setIsSidebarOpen(false);
              }}
            >
              Walls
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => {
                navigate("/create-wall");
                setIsSidebarOpen(false);
              }}
            >
              Create Wall
            </button>
          </nav>
        </div>

        <button
          onClick={() => {
            handleLogout();
            setIsSidebarOpen(false);
          }}
          className="w-full px-4 py-2 mt-4 md:mt-0 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden text-gray-800 focus:outline-none"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Walls Overview
              </h1>
            </div>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <p className="text-center text-gray-600">Loading statistics...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Walls Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Total Walls
                </h2>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.totalWalls}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  All walls created
                </p>
              </div>

              {/* Public Walls Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Public Walls
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {stats.publicWalls}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Visible to everyone
                </p>
              </div>

              {/* Private Walls Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Private Walls
                </h2>
                <p className="text-3xl font-bold text-red-600">
                  {stats.privateWalls}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Restricted access
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WallOverview;