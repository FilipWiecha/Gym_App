import { useState } from 'react';

import { Outlet, useNavigate, NavLink } from 'react-router-dom';

import { postLogOutUser } from '../../features/auth/services/AuthService';

import { useAuth } from '../../context/AuthContext';

import {
    LayoutDashboard,
    User,
    Dumbbell,
    Activity,
    ClipboardList,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

import styles from './Layout.module.css';

const navClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`;

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
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                        <NavLink to="/" end className={navClass} onClick={closeMenu}>
                            <LayoutDashboard size={18} strokeWidth={1.75} /> Main Page
                        </NavLink>
                        <NavLink to="/profile" className={navClass} onClick={closeMenu}>
                            <User size={18} strokeWidth={1.75} /> Profile
                        </NavLink>
                        <NavLink to="/exercise" className={navClass} onClick={closeMenu}>
                            <Dumbbell size={18} strokeWidth={1.75} /> Exercises
                        </NavLink>
                        <NavLink to="/workout" className={navClass} onClick={closeMenu}>
                            <Activity size={18} strokeWidth={1.75} /> Workouts
                        </NavLink>
                        <NavLink to="/trainingplan" className={navClass} onClick={closeMenu}>
                            <ClipboardList size={18} strokeWidth={1.75} /> Training plans
                        </NavLink>
                    </nav>
                </div>

                <div className={styles.sidebarBottom}>
                    <NavLink to="/settings" className={navClass} onClick={closeMenu}>
                        <Settings size={18} strokeWidth={1.75} /> Settings
                    </NavLink>
                    <button onClick={() => { closeMenu(); handleLogout(); }} className={styles.logoutBtn}>
                        <LogOut size={16} strokeWidth={1.75} /> Logout
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}
