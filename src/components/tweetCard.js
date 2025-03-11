import React from "react";
import { debounce } from "lodash";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TweetCard = ({ id, tweet, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const handleClick = debounce(() => {
        window.open(tweet.profileLink, "_blank");
    }, 300);

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
            onClick={(e) => e.stopPropagation()}
            className="relative p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 w-full"
        >
            {/* Delete Button (Top-Right) */}
            {onDelete && (
                <button
                    onClick={handleDeleteClick}
                    style={{ pointerEvents: "auto" }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                    Delete
                </button>
            )}
            {/* Centered Content */}
            <div
                {...attributes}
                {...listeners}
                className="flex flex-col items-center"
            >
                <img
                    src={tweet.profile_pic || "/placeholder.jpg"}
                    alt={tweet.author_name}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                />
                <p className="font-semibold text-gray-800">
                    {tweet.author_name}
                </p>
                <a
                    href={tweet.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline"
                    onClick={handleClick}
                >
                    @{tweet.author_name}
                </a>
                <p className="text-gray-700 text-center mt-2 break-words">
                    {tweet.content}
                </p>
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
