import { createBrowserRouter } from 'react-router-dom';

import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';



import { Layout } from './components/Layout';

import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';

import { DashboardPage } from './pages/main/Dashboard';

import { UserProfilePage } from './pages/user/profile/UserProfile';
import { UserSettingsPage } from './pages/user/settings/UserSettings';



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
                        element: <LoginPage />,
                    },
                    {
                        path: '/register',
                        element: <RegisterPage />,
                    }

                ]
            },
            // Authenticated
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/',
                        element: <DashboardPage />
                    },

                    {
                        path: '/profile',
                        element: <UserProfilePage />
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