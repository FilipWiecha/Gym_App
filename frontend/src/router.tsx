import { createBrowserRouter } from 'react-router-dom';

import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';



import { Layout } from './components/Layout';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

import { Dashboard } from './pages/main/Dashboard';
import { InfoPage } from './pages/main/Info';

import { UserProfile } from './pages/user/profile/UserProfile';
import { UserSettingsPage } from './pages/user/settings/UserSettingsPage';



export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            // Not Authenticated
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: '/login',
                        element: <Login />,
                    },
                    {
                        path: '/register',
                        element: <Register />,
                    },
                    {
                        path: '/',
                        element: <InfoPage />,
                    },
                ]
            },
            // Authenticated
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/',
                        element: <Dashboard />
                    },

                    {
                        path: '/profile',
                        element: <UserProfile />
                    },

                    {
                        path: '/settings',
                        element: <UserSettingsPage />
                    }
                ],
            },
        ]
    },
]);