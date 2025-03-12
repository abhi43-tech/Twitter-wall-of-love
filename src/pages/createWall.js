import React from "react";
import { useNavigate } from "react-router-dom";
import WallForm from "../components/walls/wallForm";

const CreateWall = () => {
  const navigate = useNavigate();

  const handleWallCreated = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Create a New Wall</h2>
      <WallForm onWallCreated={handleWallCreated} />
    </div>
  );
};

export default CreateWall;
