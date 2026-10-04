import { Link } from 'react-router-dom';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

export function RegisterPage() {
    return (
        <div className="login-layout">
            {/* Lewy panel brandingowy */}
            <div className="login-sidebar">
                <div className="logo">
                    <div className="logo-icon">G</div>
                    <span>GymApp</span>
                </div>
                <div className="sidebar-content">
                    <span className="eyebrow">Rozpocznij</span>
                    <h1>Zbuduj formę życia</h1>
                    <p>Załóż darmowe konto i śledź swoje postępy z łatwością dzięki nowoczesnym narzędziom.</p>
                </div>
                <div className="sidebar-footer">© {new Date().getFullYear()} GymApp</div>
            </div>

            <main className="login-main">
                <nav className="main-nav">
                    <Link to="/help">Centrum pomocy</Link>
                </nav>

                <div className="auth-wrapper">
                    <div className="form-header">
                        <h2>Utwórz konto</h2>
                        <p>Konto w aplikacji jest całkowicie darmowe.</p>
                    </div>

                    <RegisterForm />

                    <p className="register-prompt">
                        Masz już konto? <Link to="/login">Zaloguj się</Link>
                    </p>
                </div>

                <div className="main-footer">
                    <Link to="/privacy">Prywatność</Link>
                    <Link to="/terms">Regulamin</Link>
                </div>
            </main>
        </div>
    );
}