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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const logoUrl = user?.profile_pic || defaultImage;

    useEffect(() => {
        const fetchWalls = async () => {
            try {
                if (!user) {
                    navigate("/login");
                    return;
                }
                const response = await api.get(API_ENDPOINTS.GET_ALL_WALLS);
                const wallData = Array.isArray(response.data)
                    ? response.data
                    : [];
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
        if (!window.confirm("Are you sure you want to delete this wall?"))
            return;
        try {
            await api.delete(API_ENDPOINTS.DELETE_WALL(wallId));
            setWalls(walls.filter((wall) => wall.id !== wallId));
        } catch (err) {
            setError("Failed to delete wall. Please try again.");
        }
    };

    const handleShareWall = async (wallId) => {
        try {
            const response = await api.get(
                API_ENDPOINTS.GENERATE_SHARABLE_LINK(wallId)
            );
            navigator.clipboard.writeText(response.data.link);
            alert("Sharable link copied to clipboard!");
        } catch (err) {
            setError("Failed to generate sharable link");
        }
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
            alert("Embed code copied to clipboard!");
        } catch (err) {
            setError("Failed to generate embed code");
        }
    };

    const handleWallClick = (wallId) => {
        navigate(`/walls/${wallId}/tweets`);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar (Hidden on Mobile by Default) */}
            <aside
                className={`w-64 bg-white shadow-md fixed inset-y-0 left-0 z-50 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-64 md:h-full p-6 flex flex-col justify-between`}
            >
                <div>
                    {/* User Profile */}
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

                    {/* Navigation */}
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
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                            onClick={() => {
                                navigate("/wall-overview");
                                setIsSidebarOpen(false);
                            }}
                        >
                            Overview
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                            onClick={() => {
                                navigate("/dashboard");
                                setIsSidebarOpen(false); // Close sidebar on mobile
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

                {/* Logout */}
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
                <div className="max-w-full mx-auto">
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
                                Your Walls
                            </h1>
                        </div>
                    </div>

                    {/* Walls Table */}
                    {loading ? (
                        <p className="text-center text-gray-600">
                            Loading your walls...
                        </p>
                    ) : error ? (
                        <p className="text-center text-red-600">{error}</p>
                    ) : walls.length === 0 ? (
                        <p className="text-center text-gray-600">
                            No walls yet. Create one to get started!
                        </p>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 text-left text-sm md:text-base">
                                        <th className="py-3 px-4 w-16 md:w-20 hidden md:table-cell">
                                            Logo
                                        </th>
                                        <th className="py-3 px-4 w-1/4">
                                            Title
                                        </th>
                                        <th className="py-3 px-4 w-1/2">
                                            Description
                                        </th>
                                        <th className="py-3 px-4 w-1/4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {walls.map((wall) => (
                                        <tr
                                            key={wall.id}
                                            className="border-t hover:bg-gray-50 transition align-top"
                                            onClick={() =>
                                                handleWallClick(wall.id)
                                            }
                                        >
                                            {/* Logo (Hidden on Mobile) */}
                                            <td
                                                className="py-4 px-4 hidden md:table-cell"
                                                onClick={() =>
                                                    handleWallClick(wall.id)
                                                }
                                            >
                                                <img
                                                    src={
                                                        wall?.logo ||
                                                        defaultImage
                                                    }
                                                    alt={wall.title}
                                                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                                                />
                                            </td>

                                            {/* Title */}
                                            <td className="py-4 px-4">
                                                <span className="text-base md:text-lg font-semibold text-gray-800">
                                                    {wall.title ||
                                                        "Untitled Wall"}
                                                </span>
                                            </td>

                                            {/* Description */}
                                            <td className="py-4 px-4">
                                                <div
                                                    className="text-sm md:text-base text-gray-600 line-clamp-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            wall.description ||
                                                            "No description",
                                                    }}
                                                />
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <img
                                                        src={updateIcon}
                                                        alt="Update"
                                                        className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-75 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(
                                                                `/walls/${wall.id}/edit`
                                                            );
                                                        }}
                                                    />
                                                    <img
                                                        src={deleteIcon}
                                                        alt="Delete"
                                                        className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-75 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteWall(
                                                                wall.id
                                                            );
                                                        }}
                                                    />
                                                    <img
                                                        src={shareIcon}
                                                        alt="Share"
                                                        className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-75 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShareWall(
                                                                wall.id
                                                            );
                                                        }}
                                                    />
                                                    <img
                                                        src={embedCodeIcon}
                                                        alt="Embed Code"
                                                        className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-75 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleGenerateEmbedCode(
                                                                wall.id
                                                            );
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
