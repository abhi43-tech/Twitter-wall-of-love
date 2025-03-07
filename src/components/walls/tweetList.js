import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { API_ENDPOINTS } from "../../services/apiEndpoints";
import TweetCard from "../tweetCard"; // Adjust the import path as needed

const TweetList = ({ wallId }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tweets when the component mounts or wallId changes
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        if (!wallId) {
          throw new Error("Wall ID is required to fetch tweets");
        }
        const response = await api.get(API_ENDPOINTS.GET_TWEETS_BY_WALL(wallId));
        setTweets(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Tweets Error:", err.message);
        setError(err.response?.data?.message || "Failed to load tweets");
        setLoading(false);
      }
    };

    fetchTweets();
  }, [wallId]);

  // Handle randomization of tweets via backend
  const handleRandomize = async () => {
    try {
      setError(null);
      if (tweets.length === 0) {
        setError("No tweets to randomize");
        return;
      }
      const response = await api.patch(API_ENDPOINTS.REORDER_TWEETS(wallId));
      setTweets(response.data || []);
    } catch (err) {
      console.error("Randomize Tweets Error:", err.message);
      setError(err.response?.data?.message || "Failed to randomize tweets");
    }
  };

  // Handle deletion of a tweet
  const handleDelete = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;

    try {
      setError(null);
      await api.delete(API_ENDPOINTS.DELETE_TWEET(wallId, tweetId));
      setTweets(tweets.filter((tweet) => tweet.id !== tweetId));
    } catch (err) {
      console.error("Delete Tweet Error:", err.message);
      setError(err.response?.data?.message || "Failed to delete tweet");
    }
  };

  // Loading and error states
  if (loading)
    return <div className="text-center p-6 text-gray-500">Loading tweets...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Randomize Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRandomize}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={tweets.length === 0 || loading}
        >
          Randomize Tweets
        </button>
      </div>
      {/* Tweet Grid */}
      {tweets.length === 0 ? (
        <div className="text-center p-6 text-gray-500">No tweets added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TweetList;