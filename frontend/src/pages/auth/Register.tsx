import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRegisterUser } from '../../api/auth/AuthService';
import styles from './Register.module.css';

export function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        birthDate: ''
    });
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

        try {
            await postRegisterUser(formData);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Rejestracja nie powiodła się.');
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Rejestracja</h2>
                
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.inputGroup}>
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} className={styles.input} required />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} required />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Hasło</label>
                    <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={styles.input} required />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName">Imię</label>
                        <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName">Nazwisko</label>
                        <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={styles.input} required />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="birthDate">Data urodzenia</label>
                    <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className={styles.input} required />
                </div>

                <button type="submit" className={styles.button}>
                    Zarejestruj się
                </button>
            </form>
        </div>
    );
}