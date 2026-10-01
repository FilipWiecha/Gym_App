import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { postLogOutUser } from '../api/auth/AuthService';
import { useAuth } from '../context/AuthContext';

export function Layout() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, role } = useAuth();

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
                    Main Page
                </NavLink>

                {isAuthenticated ? (
                    <>
                        <NavLink to="/profile" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Profile {role == "ROLE_USER" ? "": " - ADMIN"}
                        </NavLink>

                        <NavLink to="/settings" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Settings
                        </NavLink>

                        <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                        <NavLink to="/login" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Sign in
                        </NavLink>
                        <NavLink to="/register" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                            Register
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