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
    const logoUrl =
        user?.profile_pic ??
        "https://www.pngmart.com/files/23/Zoro-PNG-Image.png";

    useEffect(() => {
        const fetchWalls = async () => {
            try {
                if (!user) {
                    navigate("/login");
                }
                const response = await api.get(API_ENDPOINTS.GET_ALL_WALLS);
                const wallData = Array.isArray(response.data)
                    ? response.data
                    : [];
                setWalls(wallData);
                setFilteredWalls(wallData);
            } catch (err) {
                console.error("Failed to load walls:", err);
            }
        };
        fetchWalls();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredWalls(
            walls.filter((wall) => wall.title?.toLowerCase().includes(query))
        );
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Header Section */}
            <header className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-3 mb-6">
                {/* Left Section - Logo + Name */}
                <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate("/profile")}
                >
                    <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300"
                    />
                    <span className="text-base sm:text-lg font-semibold">
                        {user?.name}
                    </span>
                </div>

                {/* Right Section - Search Bar (Takes Full Width on Small Screens) */}
                <div className="w-1/2 sm:w-1/3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by wall title..."
                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </header>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/create-wall")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Create Wall
                </button>
            </div>
            {/* Walls List */}
            {filteredWalls.length === 0 ? (
                <p className="text-center text-gray-600">
                    No walls found matching your search.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredWalls.map((wall) => (
                        <div
                            key={wall.id}
                            className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                            onClick={() => navigate(`/walls/${wall.id}/tweets`)}
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src={wall.logo || "/placeholder.jpg"}
                                    alt={wall.title}
                                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {wall.title}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {wall.description}
                                    </p>
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
