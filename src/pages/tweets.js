import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import TweetList from "../components/walls/tweetList";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import Footer from "../components/footer.js";
import defaultImage from "../images/Twitter-wall-of-love.png";

const Tweets = () => {
  const { wallId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [wall, setWall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const logoUrl = wall?.logo || defaultImage;
  const isEditable = !location.pathname.includes("/public");

  useEffect(() => {
    const fetchWall = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.GET_WALL_BY_ID(wallId));
        setWall(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load wall");
        setLoading(false);
      }
    };
    fetchWall();
  }, [wallId]);

  const handleDeleteWall = async () => {
    if (!window.confirm("Are you sure you want to delete this wall?")) return;
    try {
      await api.delete(API_ENDPOINTS.DELETE_WALL(wallId));
      navigate("/dashboard"); // Redirect to dashboard after deletion
    } catch (err) {
      setError("Failed to delete wall. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }
  if (!wall) {
    return <div className="text-center text-gray-600">Wall not found</div>;
  }

  // Public View (Original Layout)
  if (!isEditable) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <div className="text-center mt-12 mb-20">
          <h1 className="text-6xl font-semibold">{wall?.title}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {wall?.description || "No description available."}
          </p>
        </div>
        <TweetList wallId={wallId} isEditable={isEditable} />
        <Footer socialLinks={wall?.socialLinks} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-full p-6 flex flex-col justify-between">
        <div>
          {/* Wall Logo and Title */}
          <div
            className="flex items-center space-x-3 mb-8 cursor-pointer"
            onClick={() => navigate(`/walls/${wallId}/edit`)}
          >
            <img
              src={logoUrl}
              alt="Wall Logo"
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
            <span className="text-lg font-semibold text-gray-800">
              {wall?.title || "Untitled Wall"}
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            <button
              className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              onClick={() => navigate(`/walls/${wallId}/tweets`)}
            >
              Tweets
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => navigate(`/walls/${wallId}/create-tweet`)}
            >
              Create Tweet
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={() => navigate(`/walls/${wallId}/edit`)}
            >
              Settings
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              onClick={handleDeleteWall}
            >
              Delete Wall
            </button>
          </nav>
        </div>

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <TweetList wallId={wallId} isEditable={isEditable} />
        </div>
      </main>
    </div>
  );
};

export default Tweets;