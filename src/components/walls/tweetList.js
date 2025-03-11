import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { API_ENDPOINTS } from "../../services/apiEndpoints";
import TweetCard from "../tweetCard";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

const TweetList = ({ wallId }) => {
    const [tweets, setTweets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWalls = async () => {
            try {
                let response = await api.get(
                    API_ENDPOINTS.GET_TWEETS_BY_WALL(wallId)
                );
                const tweetData = Array.isArray(response.data)
                    ? response.data
                    : [];
                setTweets(tweetData);
            } catch (err) {
                setError("Failed to load wall");
            }
        };
        fetchWalls();
    }, [wallId]);

    // Handle randomization of tweets via backend
    const handleRandomize = async () => {
        try {
            setError(null);
            if (tweets.length === 0) {
                setError("No tweets to randomize");
                return;
            }
            const response = await api.patch(
                API_ENDPOINTS.REORDER_TWEETS(wallId)
            );
            setTweets(response.data);
        } catch (err) {
            console.error("Randomize Tweets Error:", err.message);
            setError(
                err.response?.data?.message || "Failed to randomize tweets"
            );
        }
    };

    // Handle deletion of a tweet
    const handleDelete = async (tweetId) => {
        if (!window.confirm("Are you sure you want to delete this tweet?"))
            return;

        try {
            setError(null);
            await api.delete(API_ENDPOINTS.DELETE_TWEET(wallId, tweetId)); // Use parent's onDelete callback
        } catch (err) {
            console.error("Delete Tweet Error:", err.message);
            setError(err.response?.data?.message || "Failed to delete tweet");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = tweets.findIndex((tweet) => tweet.id === active.id);
        const newIndex = tweets.findIndex((tweet) => tweet.id === over.id);

        // Reorder tweets locally
        const reorderedTweets = [...tweets];
        const [movedTweet] = reorderedTweets.splice(oldIndex, 1);
        reorderedTweets.splice(newIndex, 0, movedTweet);

        // Update order values based on new positions
        const updatedTweets = reorderedTweets.map((tweet, index) => ({
            id: tweet.id,
            order: index,
        }));

        try {
            setError(null);
            const response = await api.patch(
                API_ENDPOINTS.REORDER_TWEETS(wallId),
                updatedTweets
            );

            if (response.data) {
                setTweets(response.data); // Sync with API response
            }
        } catch (err) {
            console.error("Error reordering tweets:", err);
            setError(err.response?.data?.message || "Failed to reorder tweets");
        }
    };

    // Error state
    if (error)
        return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            {/* Randomize Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleRandomize}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={tweets.length === 0}
                >
                    Randomize Tweets
                </button>
            </div>

            {tweets.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                    No tweets added yet.
                </div>
            ) : (
                <DndContext
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SortableContext
                            items={tweets}
                            strategy={rectSortingStrategy}
                        >
                            {tweets.map((tweet) => (
                                <TweetCard
                                    id={tweet.id}
                                    key={tweet.id}
                                    tweet={tweet}
                                    onDelete={() => handleDelete(tweet.id)}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            )}
        </div>
    );
};

export default TweetList;
