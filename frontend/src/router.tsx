import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Przykładowe importy widoków
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/main/Dashboard';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        element: <ProtectedRoute />, // Zabezpiecza wszystkie ścieżki w 'children'
        children: [
            {
                path: '/', // Główny widok po zalogowaniu
                element: <Dashboard />,
            }
        ],
    },
]);