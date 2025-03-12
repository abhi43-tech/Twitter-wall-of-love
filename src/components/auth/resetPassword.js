import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { resetPassword } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(token, newPassword);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Reset Password
                </h2>

                {error && (
                    <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center border border-red-400">
                        {error}
                    </p>
                )}

                <form onSubmit={handleResetSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Token
                        </label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            minLength={8}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
