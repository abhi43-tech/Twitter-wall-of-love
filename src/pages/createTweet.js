import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TweetForm from '../components/walls/tweetForm'; // Adjust path as needed

const CreateWall = () => {
  const { wallId } = useParams();
  const navigate = useNavigate();

  const handleTweetCreated = () => {
    navigate(`/walls/${wallId}/tweets`); // Adjust to '/' if dashboard is at root
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add a New Tweet</h2>
      <TweetForm onTweetAdded={handleTweetCreated} wallId={wallId} />
    </div>
  );
};

export default CreateWall;