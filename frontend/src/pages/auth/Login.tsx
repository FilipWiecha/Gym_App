import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { postLoginUser } from '../../features/auth/services/AuthService';
import { PasswordInput } from '../../features/auth/components/PasswordInput';

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [requiresTotp, setRequiresTotp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await postLoginUser({ 
                username, 
                password,
                totpCode: requiresTotp ? totpCode : undefined,
                rememberMe: rememberMe
            });
            login(data.accessToken);
            navigate('/');
        } catch (err: any) {
            if (err.message === 'TOTP_REQUIRED') {
                setRequiresTotp(true);
            } else if (err.message === 'INVALID_TOTP_CODE') {
                setError('Nieprawidłowy kod uwierzytelniający.');
            } else {
                setError('Nieprawidłowy login lub hasło.');
            }
        }
    };

    return (
        <div className="login-layout">
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

                <div className="auth-wrapper">
                    <div className="form-header">
                        <h2>{requiresTotp ? 'Weryfikacja dwuetapowa' : 'Zaloguj się'}</h2>
                        <p>{requiresTotp ? 'Wprowadź kod z aplikacji uwierzytelniającej.' : 'Wprowadź swoje dane autoryzacyjne.'}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        {!requiresTotp ? (
                            <>
                                <div className="input-group">
                                    <label htmlFor="username">Login</label>
                                    <div className="input-with-icon">
                                        <User className="icon-left" size={18} />
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Wprowadź nazwę użytkownika"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="password">Hasło</label>
                                    <div className="input-with-icon">
                                        <Lock className="icon-left" size={18} />
                                        <PasswordInput 
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-options" style={{flexDirection: "row"}}>
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
                            </>
                        ) : (
                            <div className="input-group">
                                <label htmlFor="totpCode">Kod uwierzytelniający</label>
                                <div className="input-with-icon">
                                    <ShieldCheck className="icon-left" size={18} />
                                    <input
                                        id="totpCode"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        value={totpCode}
                                        onChange={(e) => setTotpCode(e.target.value)}
                                        placeholder="000000"
                                        required
                                        autoFocus
                                        style={{ letterSpacing: '4px', textAlign: 'center', fontWeight: 600 }}
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="submit-btn">
                            {requiresTotp ? 'Weryfikuj i zaloguj' : 'Zaloguj się'}
                        </button>
                        
                        {requiresTotp && (
                            <button 
                                type="button" 
                                onClick={() => { setRequiresTotp(false); setTotpCode(''); setError(null); }} 
                                className="btn-secondary" 
                                style={{ width: '100%', marginTop: '12px' }}
                            >
                                <ArrowLeft size={16} /> Wróć do logowania
                            </button>
                        )}
                    </form>

                    {!requiresTotp && (
                        <p className="register-prompt">
                            Nie masz jeszcze konta? <Link to="/register">Utwórz konto</Link>
                        </p>
                    )}
                </div>

                <div className="main-footer">
                    <Link to="/privacy">Prywatność</Link>
                    <Link to="/terms">Regulamin</Link>
                </div>
            </main>
        </div>
    );
}