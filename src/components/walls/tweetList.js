import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { API_ENDPOINTS } from "../../services/apiEndpoints";
import TweetCard from "../tweetCard";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

const TweetList = ({ wallId }) => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await api.get(API_ENDPOINTS.GET_TWEETS_BY_WALL(wallId));
                setTweets(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError("Failed to load tweets");
            } finally {
                setLoading(false);
            }
        };
        fetchTweets();
    }, [wallId]);

    const handleRandomize = async () => {
        try {
            if (tweets.length === 0) return setError("No tweets to randomize");
            const response = await api.patch(API_ENDPOINTS.REORDER_TWEETS(wallId));
            setTweets(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to randomize tweets");
        }
    };

    const handleDelete = async (tweetId) => {
        if (!window.confirm("Are you sure you want to delete this tweet?")) return;

        try {
            await api.delete(API_ENDPOINTS.DELETE_TWEET(wallId, tweetId));
            setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete tweet");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = tweets.findIndex((tweet) => tweet.id === active.id);
        const newIndex = tweets.findIndex((tweet) => tweet.id === over.id);
        const reorderedTweets = [...tweets];
        const [movedTweet] = reorderedTweets.splice(oldIndex, 1);
        reorderedTweets.splice(newIndex, 0, movedTweet);

        const updatedTweets = reorderedTweets.map((tweet, index) => ({
            id: tweet.id,
            order: index,
        }));

        try {
            const response = await api.patch(API_ENDPOINTS.REORDER_TWEETS(wallId), updatedTweets);
            setTweets(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reorder tweets");
        }
    };

    return (
        <div className="p-4 md:p-6">
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 gap-2">
                <h2 className="text-lg md:text-xl font-semibold">Tweet Wall</h2>
                <button
                    onClick={handleRandomize}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
                    disabled={tweets.length === 0}
                >
                    Randomize Tweets
                </button>
            </div>

            {loading ? (
                <div className="text-center p-6 text-gray-500">Loading tweets...</div>
            ) : tweets.length === 0 ? (
                <div className="text-center p-6 text-gray-500">No tweets added yet.</div>
            ) : (
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <SortableContext items={tweets.map(tweet => tweet.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                            {tweets.map((tweet) => (
                                <TweetCard
                                    key={tweet.id}
                                    id={tweet.id}
                                    tweet={tweet}
                                    onDelete={() => handleDelete(tweet.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};

export default TweetList;
