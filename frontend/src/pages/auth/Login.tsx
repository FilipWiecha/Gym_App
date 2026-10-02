import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { postLoginUser } from '../../features/auth/services/AuthService';


export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            
            const data = await postLoginUser({ username: username, password });
            login(data.accessToken);
            navigate('/');
        } catch (err: any) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-layout">
            {/* Prawy panel logowania */}
            <main className="login-main">
                <nav className="main-nav">
                    <a href="/help">Help Center</a>
                </nav>

                <div className="form-wrapper">
                    <div className="form-header">
                        <h2>Zaloguj się</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="input-group">
                            <label htmlFor="username">Login</label>
                            <div className="input-with-icon">
                                <Mail className="icon-left" size={18} />
                                <input
                                    id="username"
                                    type="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="filipwiecha12"
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
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    required
                                />
                                <Eye className="icon-right action" size={18} />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <a href="/reset-password" className="text-link">Forgot your password?</a>
                        </div>

                        <button type="submit" className="submit-btn">
                            Sign in
                        </button>
                    </form>

                    <p className="register-prompt">
                        Don't have an account yet? <a href="/register">Create an account</a>
                    </p>
                </div>

                <div className="main-footer">
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Conditions</a>
                </div>
            </main>
        </div>
    );
}