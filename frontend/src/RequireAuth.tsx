import React from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
    children: React.ReactNode;
}

function RequireAuth({children} : RequireAuthProps) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default RequireAuth;