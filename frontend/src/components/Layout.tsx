import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { postLogOutUser } from '../api/auth/AuthService';
import { useAuth } from '../context/AuthContext';

export function Layout() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await postLogOutUser();
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ 
                display: 'flex', 
                gap: '20px', 
                padding: '15px 20px', 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #dee2e6'
            }}>
                <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                    Strona Główna
                </NavLink>

                {isAuthenticated ? (
                    <>
                        <NavLink to="/profile" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Profil
                        </NavLink>
                        <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                            Wyloguj
                        </button>
                    </>
                ) : (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                        <NavLink to="/login" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Logowanie
                        </NavLink>
                        <NavLink to="/register" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Rejestracja
                        </NavLink>
                    </div>
                )}
            </nav>
            
            <main style={{ padding: '20px', flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
}