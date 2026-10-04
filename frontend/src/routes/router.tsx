import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '../pages/auth/Login';
import { RegisterPage } from '../pages/auth/Register';
import { UserSettingsPage } from '../pages/user/settings/UserSettings';
import { ExerciseAddPage } from '../pages/exercise/ExerciseAddPage';
import { ExerciseDetailsPage } from '../pages/exercise/ExerciseDetailsPage';
import { WorkoutListPage } from '../pages/workout/WorkoutListPage';
import { TrainingPlanListPage } from '../pages/trainingplan/TrainingPlanListPage';
import { TrainingPlanAddPage } from '../pages/trainingplan/TrainingPlanAddPage';
import { TrainingPlanDetailsPage } from '../pages/trainingplan/TrainingPlanDetailsPage';
import { WorkoutAddPage } from '../pages/workout/WorkoutAddPage';
import { WorkoutDetailsPage } from '../pages/workout/WorkoutDetailsPage';
import { ExerciseListPage } from '../pages/exercise/ExerciseListPage';
import { DashboardPage } from '../pages/main/DashboardPage';
import { ProfilePage } from '../pages/user/profile/ProfilePage';





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
                        element: <ProfilePage />
                    },

                    {
                        path: '/settings',
                        element: <UserSettingsPage />
                    },

                    {
                        path: '/exercise',
                        element: <ExerciseListPage />
                    },
                    
                    {
                        path: '/exercise/new',
                        element: <ExerciseAddPage />
                    },

                    {
                        path: '/exercise/:id',
                        element: <ExerciseDetailsPage />
                    },

                    {
                        path: '/workout',
                        element: <WorkoutListPage />
                    },

                    {
                        path: '/workout/new',
                        element: <WorkoutAddPage />
                    },

                    {
                        path: '/workout/:id',
                        element: <WorkoutDetailsPage />
                    },

                    {
                        path: '/trainingplan',
                        element: <TrainingPlanListPage />
                    },

                    {
                        path: '/trainingplan/new',
                        element: <TrainingPlanAddPage />
                    },

                    {
                        path: '/trainingplan/:id',
                        element: <TrainingPlanDetailsPage />
                    }
                ],
            },
        ]
    },
]);