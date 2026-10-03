import { useState } from 'react';

import { Outlet, useNavigate, Link } from 'react-router-dom';

import { postLogOutUser } from '../../features/auth/services/AuthService';

import { useAuth } from '../../context/AuthContext';

import { 
    LayoutDashboard, 
    User, 
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

import styles from './Layout.module.css';

export function Layout() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await postLogOutUser();
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return <Outlet />;
    }

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className={styles.appLayout}>
            
            <div className={styles.mobileHeader}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>G</span>
                    Gym App
                </div>
                <button onClick={toggleMenu} className={styles.menuToggleBtn} aria-label="Menu">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            
            {isMobileMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}

            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarTop}>
                    <div className={styles.logoDesktop}>
                        <span className={styles.logoIcon}>G</span>
                        Gym App
                    </div>
                    
                    <nav className={styles.navLinks}>
                        <Link to="/" className={styles.navItem} onClick={closeMenu}>
                            <LayoutDashboard size={18} /> Main Page
                        </Link>
                        <Link to="/profile" className={styles.navItem} onClick={closeMenu}>
                            <User size={18} /> Profile
                        </Link>
                        <Link to="/exercise" className={styles.navItem} onClick={closeMenu}>
                            <User size={18} /> Exercises
                        </Link>
                        <Link to="/settings" className={styles.navItem} onClick={closeMenu}>
                            <Settings size={18} /> Settings
                        </Link>
                    </nav>
                </div>

                <div className={styles.sidebarBottom}>
                    <button onClick={() => { closeMenu(); handleLogout(); }} className={styles.logoutBtn}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}