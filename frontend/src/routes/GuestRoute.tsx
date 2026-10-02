import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MoonLoader } from "react-spinners";

export function GuestRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if(isLoading){
        return (<MoonLoader color="#000000"/>);
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}