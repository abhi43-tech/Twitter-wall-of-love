import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import TweetForm from "../components/walls/tweetForm";

const CreateWall = () => {
    const { wallId } = useParams();
    const navigate = useNavigate();

    const handleTweetCreated = () => {
        navigate(`/walls/${wallId}/tweets`);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add a New Tweet</h2>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
                <span className="text-lg">←</span> <span>Back</span>
            </button>
            <TweetForm onTweetAdded={handleTweetCreated} wallId={wallId} />
        </div>
    );
};

export default CreateWall;
