import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { url } from "../App";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            setIsLoggedIn(true);
            fetchProfile();
        } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setUser(null);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${url}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.user) setUser(res.data.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${url}/api/auth/login`, { email, password });
            if (res.data.token) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true, message: res.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${url}/api/auth/register`, { name, email, password });
            return { success: true, message: res.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    const contextValue = { user, token, isLoggedIn, login, register, logout };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
