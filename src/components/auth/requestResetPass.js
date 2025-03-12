import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const RequestResetPassword = () => {
    const { requestResetPassword } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            const response = await requestResetPassword(email);
            setMessage(response.message || "Reset token sent successfully!");
            setTimeout(() => navigate("/reset-password"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Request failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Request Password Reset
                </h2>

                {error && (
                    <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center border border-red-400">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="bg-green-100 text-green-600 p-3 rounded mb-4 text-center border border-green-400">
                        {message}
                    </p>
                )}

                <form onSubmit={handleRequestSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
                    >
                        Request Reset Token
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestResetPassword;
