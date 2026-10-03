import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '../pages/auth/Login';
import { RegisterPage } from '../pages/auth/Register';
import { DashboardPage } from '../pages/main/Dashboard';
import { UserProfilePage } from '../pages/user/profile/UserProfile';
import { UserSettingsPage } from '../pages/user/settings/UserSettings';
import { ExercisePage } from '../pages/exercise/Exercise';
import { AddExercisePage } from '../pages/exercise/AddExercise';
import { DetailsExercise } from '../pages/exercise/DetailsExercise';





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
                    },

                    {
                        path: '/exercise',
                        element: <ExercisePage />
                    },
                    
                    {
                        path: '/exercise/new',
                        element: <AddExercisePage />
                    },

                    {
                        path: '/exercise/detail',
                        element: <DetailsExercise />
                    }
                ],
            },
        ]
    },
]);