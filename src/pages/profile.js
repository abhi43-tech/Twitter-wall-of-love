import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateUser, deleteUser, generateApiToken } =
        useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(user?.profile_pic || "");
    const [apiToken, setApiToken] = useState(user?.api_token || "");
    const [error, setError] = useState("");
    const [updateStatus, setStatus] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setApiToken(user.api_token || "");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUser(name, email, profilePic);
            setStatus("Profile updated successfully");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            setStatus("Failed to update profile");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Profile picture must be less than 2 MB");
                return;
            }
            if (file.type !== "image/png") {
                setError("Profile picture must be a PNG file");
                return;
            }
            setProfilePic(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateApiToken = async () => {
        try {
            const response = await generateApiToken();
            setApiToken(response.apiToken);
        } catch (err) {
            setError("Failed to generate API token");
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteUser();
            window.location.href = "/";
        } catch (err) {
            setError("Failed to delete account");
        }
    };

    if (!user)
        return (
            <div className="text-center p-6">
                Please log in to view your profile.
            </div>
        );

        return (
            <div className="p-6 max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <span className="text-lg">←</span> <span>Back</span>
                </button>
        
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Profile
                </h2>
        
                {updateStatus && (
                    <p className="text-green-600 text-center font-semibold mb-4">
                        {updateStatus}
                    </p>
                )}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        
                {/* Profile Form */}
                <form
                    onSubmit={handleUpdate}
                    className="bg-white p-6 rounded-xl shadow-md"
                >
                    <div className="mb-6 text-center">
                        <label className="block text-gray-700 font-medium mb-2">
                            Profile Picture
                        </label>
                        {preview && (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-gray-300 shadow-sm"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/png"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
        
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
        
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
        
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Update Profile
                    </button>
                </form>
        
                {/* API Token Section */}
                <div className="bg-white p-6 rounded-xl shadow-md mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        API Token
                    </h3>
                    {apiToken ? (
                        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                            <code className="text-gray-700">
                                {apiToken.slice(0, 5)}...{apiToken.slice(-5)}
                            </code>
                            <button
                                onClick={() => navigator.clipboard.writeText(apiToken)}
                                className="bg-gray-300 px-3 py-1 rounded text-sm font-medium hover:bg-gray-400 transition duration-200"
                            >
                                Copy
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerateApiToken}
                            className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Generate API Token
                        </button>
                    )}
                </div>
        
                {/* Logout & Delete Buttons */}
                <div className="flex flex-col space-y-4 mt-6">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-200"
                    >
                        Delete Account
                    </button>
                </div>
        
                {/* Delete Account Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                            <p className="mb-4 text-lg font-medium text-gray-800">
                                Are you sure you want to delete your account?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={confirmDelete}
                                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
};

export default Profile;
