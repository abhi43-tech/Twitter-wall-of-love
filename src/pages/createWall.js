import React from 'react';
import { useNavigate } from 'react-router-dom';
import WallForm from '../components/walls/wallForm'; // Adjust path as needed

const CreateWall = () => {
  const navigate = useNavigate();

  const handleWallCreated = () => {
    navigate('/dashboard'); // Adjust to '/' if dashboard is at root
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create a New Wall</h2>
      <WallForm onWallCreated={handleWallCreated} />
    </div>
  );
};

export default CreateWall;