import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLoginUser } from '../../api/auth/AuthService';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';

export function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await postLoginUser({ username, password });
            login(data.accessToken);
            navigate('/');
        } catch (err: any) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Logowanie</h2>
                
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.inputGroup}>
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Zaloguj się
                </button>
            </form>
        </div>
    );
}