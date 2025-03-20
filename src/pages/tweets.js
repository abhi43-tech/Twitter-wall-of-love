import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import TweetList from "../components/walls/tweetList";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import Footer from "../components/footer.js";
import defaultImage from "../images/Twitter-wall-of-love.png";
import { AuthContext } from "../context/authContext.js";

const Tweets = () => {
    const { logout } = useContext(AuthContext);
    const { wallId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [wall, setWall] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
    const logoUrl = wall?.logo || defaultImage;
    const isEditable = !location.pathname.includes("/public");

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const response = await api.get(
                    API_ENDPOINTS.GET_WALL_BY_ID(wallId)
                );
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
        if (!window.confirm("Are you sure you want to delete this wall?"))
            return;
        try {
            await api.delete(API_ENDPOINTS.DELETE_WALL(wallId));
            navigate("/dashboard"); // Redirect to dashboard after deletion
        } catch (err) {
            setError("Failed to delete wall. Please try again.");
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Public View (Unchanged)
    if (!isEditable) {
        return (
            <div className="p-4 max-w-5xl mx-auto">
                <div className="text-center mt-12 mb-20">
                    <h1 className="text-6xl font-semibold">{wall?.title}</h1>
                    <p
                        className="text-lg text-gray-600 mt-2"
                        dangerouslySetInnerHTML={{
                            __html:
                                wall?.description ||
                                "No description available.",
                        }}
                    />
                </div>
                <TweetList wallId={wallId} isEditable={isEditable} />
                <Footer socialLinks={wall?.socialLinks} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar (Hidden on Mobile by Default) */}
            <aside
                className={`w-64 bg-white shadow-md fixed inset-y-0 left-0 z-50 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 transition-transform duration-300 ease-in-out md:h-full p-6 flex flex-col justify-between`}
            >
                <div>
                    {/* Wall Logo and Title */}
                    <div
                        className="flex items-center space-x-3 mb-8 cursor-pointer"
                        onClick={() => {
                            navigate(`/walls/${wallId}/edit`);
                            setIsSidebarOpen(false); // Close sidebar on mobile
                        }}
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
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                            onClick={() => {
                                navigate(`/profile`);
                                setIsSidebarOpen(false);
                            }}
                        >
                            Profile
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                            onClick={() => {
                                navigate(`/dashboard`);
                                setIsSidebarOpen(false);
                            }}
                        >
                            Walls
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                            onClick={() => {
                                navigate(`/walls/${wallId}/tweets`);
                                setIsSidebarOpen(false);
                            }}
                        >
                            Tweets
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                            onClick={() => {
                                navigate(`/walls/${wallId}/create-tweet`);
                                setIsSidebarOpen(false);
                            }}
                        >
                            Create Tweet
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                            onClick={() => {
                                navigate(`/walls/${wallId}/edit`);
                                setIsSidebarOpen(false);
                            }}
                        >
                            Wall Settings
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-gray-700 rounded-lg font-medium hover:bg-red-200 transition"
                            onClick={() => {
                                handleDeleteWall();
                                setIsSidebarOpen(false);
                            }}
                        >
                            Delete Wall
                        </button>
                    </nav>
                </div>

                {/* Back to Dashboard & Logout */}
                <div className="space-y-2">
                    <button
                        onClick={() => {
                            navigate("/dashboard");
                            setIsSidebarOpen(false);
                        }}
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition"
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsSidebarOpen(false);
                        }}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 md:ml-64">
                <div className="max-w-5xl mx-auto">
                    {/* Header with Hamburger Icon */}
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
                        </div>
                    </div>

                    <div className="text-center mt-12 mb-20">
                        <h1 className="text-6xl font-semibold">
                            {wall?.title}
                        </h1>
                        <p
                            className="text-lg text-gray-600 mt-2"
                            dangerouslySetInnerHTML={{
                                __html:
                                    wall?.description ||
                                    "No description available.",
                            }}
                        />
                    </div>
                    <TweetList wallId={wallId} isEditable={isEditable} />
                </div>
            </main>
        </div>
    );
};

export default Tweets;
