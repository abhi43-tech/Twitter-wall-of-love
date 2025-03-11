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
        try {
            const response = await requestResetPassword(email);
            setMessage(response.message);
            navigate("/reset-password");
        } catch (err) {
            setError(err.response?.data?.message || "Request failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Reset Password
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {message && <p className="text-green-500 mb-4">{message}</p>}
                <form onSubmit={handleRequestSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Email
                        </label>
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
                        Request Reset token
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestResetPassword;
