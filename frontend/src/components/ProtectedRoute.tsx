import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../api/apiClient";

export function ProtectedRoute(){
    const token = getAccessToken();

    if(!token){
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}