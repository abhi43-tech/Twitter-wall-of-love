import React, { useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import defaultImage from "../images/Twitter-wall-of-love.png";

const TweetCard = ({ id, tweet, onDelete, isEditable }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const handleProfileClick = useCallback(() => {
        const link = `https://x.com/${tweet.author_name}/status/${tweet.tweet_id}`;
        window.open(link, "_blank");
    }, []);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete && typeof onDelete === "function") {
            onDelete(tweet.id);
        }
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 w-full cursor-pointer"
            onDoubleClick={handleProfileClick}
        >
            {/* Delete Button (Top-Right) */}
            {onDelete && isEditable && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                    Delete
                </button>
            )}

            {/* Drag & Drop Handle */}
            <div {...attributes} {...listeners} className="flex flex-col items-center">
                {/* Profile Picture */}
                <img
                    src={tweet?.profile_pic || defaultImage}
                    alt={tweet.author_name}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                />
                
                {/* Author Name */}
                <p className="font-semibold text-gray-800">{tweet.author_name}</p>

                {/* Profile Link */}
                <a
                    href={tweet.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline focus:outline-none focus:ring focus:ring-blue-300"
                >
                    @{tweet.author_name}
                </a>

                {/* Tweet Content */}
                <p className="text-gray-700 text-center mt-2 break-words">
                    {tweet.content}
                </p>

                {/* Engagement Metrics */}
                <div className="flex space-x-4 text-gray-500 text-sm mt-2">
                    <span className="flex items-center">
                        <span className="mr-1">❤️</span> {tweet.likes || 0}
                    </span>
                    <span className="flex items-center">
                        <span className="mr-1">💬</span> {tweet.comments || 0}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;
    