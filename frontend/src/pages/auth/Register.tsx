import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRegisterUser } from '../../api/auth/AuthService';
import { Mail, Lock, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';
import type RegisterDto from '../../api/auth/dto/RegisterDto';


export function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!termsAccepted) {
            setError('You must accept the terms of use.');
            return;
        }

        try {
            // Dodaj puste/domyślne wartości dla username i birthDate, jeśli API nadal ich bezwzględnie wymaga
            await postRegisterUser({ ...formData, username: formData.email, birthDate: '1970-01-01' });
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Rejestracja nie powiodła się.');
        }
    };

    // Prosta weryfikacja siły hasła na podstawie wytycznych z UI
    const isLengthValid = formData.password.length >= 8;
    const hasNumber = /\d/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    const isPasswordStrong = isLengthValid && hasNumber && hasSpecial;

    return (
        <div className="login-layout">
            <main className="login-main">
                <nav className="main-nav">
                    <a href="/help">Help Center</a>
                </nav>

                <div className="form-wrapper">
                    <div className="form-header">
                        <h2>Create an account</h2>
                        <p>The account is completely free.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="firstName">First name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Filip"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="lastName">Last name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Wiecha"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">E-mail address</label>
                            <div className="input-with-icon">
                                <Mail className="icon-left" size={18} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="filipwiecha@wp.pl"
                                    required
                                />
                            </div>
                            <span className="input-hint">We will send a confirmation link to this address.</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-with-icon">
                                <Mail className="icon-left" size={18} />
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="ajgorinho"
                                    required
                                />
                            </div> 
                        </div>

                        <div className="input-group password-group">
                            <label htmlFor="password">Password</label>
                            <div className={`input-with-icon ${isPasswordStrong ? 'valid' : ''}`}>
                                <Lock className="icon-left" size={18} />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••"
                                    required
                                />
                                <div className="icons-right">
                                    <Eye className="icon-action" size={18} />
                                    {isPasswordStrong && <CheckCircle2 className="icon-success" size={18} />}
                                </div>
                            </div>
                            
                            <div className="password-strength">
                                <span className={`strength-req ${isPasswordStrong ? 'met' : ''}`}>
                                    Minimum 8 characters, a digit, and a special character.
                                </span>
                                <div className="strength-bars">
                                    <div className={`bar ${isLengthValid ? 'active' : ''}`}></div>
                                    <div className={`bar ${hasNumber ? 'active' : ''}`}></div>
                                    <div className={`bar ${hasSpecial ? 'active' : ''}`}></div>
                                    <div className={`bar ${isPasswordStrong ? 'active' : ''}`}></div>
                                </div>
                                {isPasswordStrong && (
                                    <div className="strength-status">
                                        <ShieldCheck size={14} />
                                        <span>Strong password</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                I accept the Terms of Use and Privacy Policy.
                            </label>
                        </div>

                        <button type="submit" className="submit-btn">
                            Create an account
                        </button>
                    </form>

                    <p className="register-prompt">
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </div>

                <div className="main-footer">
                    <a href="/privacy">Prywatność</a>
                    <a href="/terms">Warunki</a>
                </div>
            </main>
        </div>
    );
}