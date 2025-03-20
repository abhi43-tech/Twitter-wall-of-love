import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { API_ENDPOINTS } from "../../services/apiEndpoints";

const UserVerification = () => {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const searchParams = new URLSearchParams(
                    window.location.search
                );
                const token = searchParams.get("token");

                const response = await api.post(API_ENDPOINTS.VERIFY_EMAIL, {
                    token,
                });
                setSuccessMessage(response.data.message);
                setTimeout(() => navigate("/login"), 1000);
            } catch (err) {
                setError(err.response?.data?.message || "Verification failed");
                setTimeout(() => navigate("/signup"), 1000);
            }
        };

        verifyUser();
    }, []);

    if (error) {
        return (
            <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center border border-red-400">
                {error}
            </p>
        );
    }

    if (successMessage) {
        return (
            <p className="bg-green-100 text-green-600 p-3 rounded mb-4 text-center border border-green-400">
                {successMessage}
            </p>
        );
    }
};

export default UserVerification;
