import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { postLoginUser } from '../../features/auth/services/AuthService';

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await postLoginUser({ username: username, password });
            login(data.accessToken);
            navigate('/');
        } catch (err: any) {
            setError('Nieprawidłowy login lub hasło');
        }
    };

    return (
        <div className="login-layout">
            {/* Lewy panel brandingowy widoczny na desktopie */}
            <div className="login-sidebar">
                <div className="logo">
                    <div className="logo-icon">G</div>
                    <span>GymApp</span>
                </div>
                <div className="sidebar-content">
                    <span className="eyebrow">Witaj ponownie</span>
                    <h1>Zaloguj się do swojego konta</h1>
                    <p>Uzyskaj dostęp do swoich planów treningowych, historii ćwiczeń i statystyk.</p>
                </div>
                <div className="sidebar-footer">© {new Date().getFullYear()} GymApp</div>
            </div>

            <main className="login-main">
                <nav className="main-nav">
                    <Link to="/help">Centrum pomocy</Link>
                </nav>

                {/* Zmieniono z form-wrapper na auth-wrapper */}
                <div className="auth-wrapper">
                    <div className="form-header">
                        <h2>Zaloguj się</h2>
                        <p>Wprowadź swoje dane autoryzacyjne.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="input-group">
                            <label htmlFor="username">Login</label>
                            <div className="input-with-icon">
                                <Mail className="icon-left" size={18} />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Wprowadź nazwę użytkownika"
                                    required
                                />
                                {username && <CheckCircle2 className="icon-right success" size={18} />}
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Hasło</label>
                            <div className="input-with-icon">
                                <Lock className="icon-left" size={18} />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    required
                                />
                                <Eye 
                                    className="icon-right action" 
                                    size={18} 
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Zapamiętaj mnie
                            </label>
                            <Link to="/reset-password" className="text-link">Zapomniałeś hasła?</Link>
                        </div>

                        <button type="submit" className="submit-btn">
                            Zaloguj się
                        </button>
                    </form>

                    <p className="register-prompt">
                        Nie masz jeszcze konta? <Link to="/register">Utwórz konto</Link>
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