import { Link } from 'react-router-dom';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

import styles from "./auth.module.css";

export function RegisterPage() {
    return (
        <div className="login-layout">
            <main className="login-main">
                <nav className="main-nav">
                    <Link to="/help">Help Center</Link>
                </nav>

                <div className="form-wrapper">
                    <div className="form-header">
                        <h2>Create an account</h2>
                        <p>The account is completely free.</p>
                    </div>

                    <RegisterForm />

                    <p className="register-prompt">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>

                <div className="main-footer">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Conditions</Link>
                </div>
            </main>
        </div>
    );
}