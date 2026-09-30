import { createContext, useContext, useState, useEffect } from 'react';

import { setAccessToken } from '../api/apiClient';
import { postRefreshToken, postLogOutUser } from '../api/auth/AuthService';
import { getHasSession, setHasSession } from '../stores/AuthStore';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {

            try {
                if(!getHasSession()){
                    throw new Error("no session");
                }

                const data = await postRefreshToken();
                login(data.accessToken);
                setHasSession(true);
            } catch {
                setAccessToken(null);
                setIsAuthenticated(false);
                setHasSession(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = (token: string) => {
        setAccessToken(token);
        setIsAuthenticated(true);
        setHasSession(true);
    };

    const logout = async () => {
        postLogOutUser();
        setIsAuthenticated(false);
        setHasSession(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {/* Renderuj aplikację dopiero po weryfikacji tokena */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth wymaga AuthProvider");
    return context;
};