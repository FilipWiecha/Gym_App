import { createContext, useContext, useState, useEffect } from 'react';

import { setAccessToken } from '../services/apiClient';
import { clearHasSession, getHasSession, setHasSession } from '../features/auth/utils/AuthStore';
import { postLogOutUser, postRefreshToken } from '../features/auth/services/AuthService';
import type UserDto from '../features/user/types/UserDto';
import { getUserInfo } from '../features/user/services/UserService';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user:UserDto | null;
    setUser: (user:UserDto | null)=> void;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (token: string, userData?: UserDto) => {
        setAccessToken(token);
        setIsAuthenticated(true);
        setHasSession(true);
        if (userData) {
            setUser(userData);
        }
    };

    const logout = async () => {
        try {
            await postLogOutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
            clearHasSession();
        }
    };

    useEffect(() => {
        const verifySession = async () => {

            try {
                if(!getHasSession()){
                    throw new Error("no session");
                }

                const tokenData = await postRefreshToken();
                setAccessToken(tokenData.accessToken);
                setIsAuthenticated(true);
                setHasSession(true);

                const userData = await getUserInfo();
                setUser(userData);

            } catch(error) {
                setAccessToken(null);
                setUser(null);
                setIsAuthenticated(false);
                clearHasSession();
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, setUser, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth wymaga AuthProvider");
    return context;
};