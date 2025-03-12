import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout, updateUser, deleteUser, generateApiToken } =
        useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(user?.profile_pic || "");
    const [apiToken, setApiToken] = useState(user?.api_token || "");
    const [error, setError] = useState("");
    const [updateStatus, setStatus] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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

    const confirmLogout = () => {
        logout();
        navigate("/login");
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
            <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
            {updateStatus && (
                <p className="text-green-500 text-center mb-4">
                    {updateStatus}
                </p>
            )}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <div>
                    <label className="block text-gray-700 mb-2">Profile Pic</label>
                    {preview && (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full mx-auto mb-2 border-2"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/png"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Update Profile
                </button>
            </form>

            {/* API Token Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-semibold mb-4">API Token</h3>
                {apiToken ? (
                    <div className="flex items-center space-x-2">
                        <p className="text-sm">
                            <code>
                                {apiToken.slice(0, 5)}...{apiToken.slice(-5)}
                            </code>
                        </p>
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(apiToken)
                            }
                            className="bg-gray-300 px-2 py-1 rounded text-sm"
                        >
                            Copy
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleGenerateApiToken}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Generate API Token
                    </button>
                )}
            </div>

            {/* Logout & Delete Buttons */}
            <div className="flex flex-col space-y-4 mt-6">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Log Out
                </button>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                    Delete Account
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="mb-4">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Yes, Log Out
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="mb-4">
                            Are you sure you want to delete your account?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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
