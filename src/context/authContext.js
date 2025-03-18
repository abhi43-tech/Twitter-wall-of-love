import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("Access");
        if (token) {
            api.get(API_ENDPOINTS.GET_USER)
                .then((response) => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const signup = async (name, email, password, profilePic) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (profilePic) formData.append("image", profilePic);
        const response = await api.post(API_ENDPOINTS.SIGNUP, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    };

    const login = async (email, password) => {
        const response = await api.post(API_ENDPOINTS.LOGIN, {
            email,
            password,
        });
        const { token } = response.data;

        // Store the token in a cookie named 'Access'
        Cookies.set("Access", token, {
            expires: 7,
            secure: true,
            sameSite: "Strict",
        });
        const userResponse = await api.get(API_ENDPOINTS.GET_USER);
        await setUser(userResponse.data);
    };

    const logout = async () => {
        await api.post(API_ENDPOINTS.LOGOUT);
        // Remove the 'Access' cookie on logout
        Cookies.remove("Access");
        setUser(null);
    };

    const requestResetPassword = async (email) => {
        const response = await api.post(API_ENDPOINTS.REQUEST_RESET_PASSWORD, {
            email,
        });
        return response.data;
    };

    const resetPassword = async (token, newPassword) => {
        const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
            token,
            password: newPassword,
        });
        return response.data;
    };

    const updateUser = async (name, email, profilePic) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("image", profilePic);
        const response = await api.put(API_ENDPOINTS.UPDATE_USER, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setUser(response.data);
        return response.data;
    };

    const deleteUser = async () => {
        const response = await api.delete(API_ENDPOINTS.DELETE_USER);
        // Cookies.remove("Access");
        setUser(null);
        return response.data;
    };

    const generateApiToken = async () => {
        const response = await api.post(API_ENDPOINTS.GENERATE_API_TOKEN);
        setUser({ ...user, api_token: response.data.apiToken });
        return response.data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signup,
                login,
                logout,
                requestResetPassword,
                resetPassword,
                updateUser,
                deleteUser,
                generateApiToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
