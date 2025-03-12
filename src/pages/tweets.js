import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import TweetList from "../components/walls/tweetList";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import Footer from "../components/footer.js";

const Tweets = () => {
    const { wallId } = useParams();
    const navigate = useNavigate();
    const [wall, setWall] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultLogo = "https://tse2.mm.bing.net/th?id=OIP.RSzoqHXu3mhO0ovCOK4HrQHaEK&pid=Api&P=0&h=180"; // Fallback logo

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

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }
    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }
    if (!wall) {
        return <div className="text-center text-gray-600">Wall not found</div>;
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Header Section */}
						<header className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-3 mb-6">
                {/* Left Section - Logo + Name */}
                <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate(`/walls/${wallId}/edit`)}
                >
                    <img
                        src={wall?.logo || defaultLogo}
                        alt="Wall Logo"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300"
                    />
                    <h2 className="text-xl font-bold text-gray-800">
                        {wall?.title || "User's Wall"}
                    </h2>
                </div>

                {/* Right Section - Search Bar (Takes Full Width on Small Screens) */}
                <button
                    onClick={() => navigate(`/walls/${wallId}/create-tweet`)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Create Tweet
                </button>
            </header>

            {/* Wall Title & Description */}
            <div className="text-center mt-12 mb-20">
                <h1 className="text-6xl font-semibold">{wall?.title}</h1>
                <p className="text-lg text-gray-600 mt-2">
                    {wall?.description || "No description available."}
                </p>
            </div>

            {/* Tweet List */}
            <TweetList wallId={wallId} />

            {/* Footer */}
            <Footer socialLinks={wall?.socialLinks} />
        </div>
    );
};

export default Tweets;
