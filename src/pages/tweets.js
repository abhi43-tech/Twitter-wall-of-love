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
    const logoUrl = "/path-to-logo.png"; // Fallback logo if wall.logo is unavailable

    useEffect(() => {
        const fetchWalls = async () => {
            try {
                const response = await api.get(API_ENDPOINTS.GET_WALL_BY_ID(wallId));
                setWall(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load wall");
                setLoading(false);
            }
        };
        fetchWalls();
    }, [wallId]);


    if (loading)
        return <div className="text-center text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;
    if (!wall)
        return <div className="text-center text-gray-600">Wall not found</div>;

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={wall?.logo || logoUrl}
                        alt="Logo"
                        className="w-10 h-10 rounded-full"
                    />
                    <h2 className="text-2xl font-bold">
                        {wall?.title || "User's Wall"}
                    </h2>
                </div>

                <div className="space-x-4">
                    <button
                        onClick={() =>
                            navigate(`/walls/${wallId}/create-tweet`)
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Create Tweet
                    </button>
                    <button
                        onClick={() => navigate(`/walls/${wallId}/edit`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Settings
                    </button>
                </div>
            </div>

            {/* Wall title and description */}
            <div className="text-center mt-24 mb-36">
                <h1 className="text-9xl font-semibold">{wall?.title}</h1>
                <p className="text-2xl text-gray-600">
                    {wall?.description || "No description available."}
                </p>
            </div>

            {/* Tweet List */}
            <TweetList
                wallId={wallId}
            />

            <Footer socialLinks={wall?.socialLinks} />
        </div>
    );
};

export default Tweets;
