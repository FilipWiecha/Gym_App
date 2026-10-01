import { useState } from 'react';
import styles from './UserSettings.module.css';
import type { UserUpdateDto } from '../../../api/user/Dto/UserUpdateDto';
import { getUserInfo, patchUpdateUser } from '../../../api/user/UserService';
import { useApiValidation } from '../../../hooks/useApiValidation';

export function UserSettingsPage() {
    const [formData, setFormData] = useState<UserUpdateDto>();
    
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const { fieldErrors, handleApiError, clearErrors } = useApiValidation();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: '' });
        clearErrors();

        const payload: Partial<UserUpdateDto> = { ...formData };
        (Object.keys(payload) as (keyof UserUpdateDto)[]).forEach(key => {
            if (payload[key] === "") {
                delete payload[key];
            }
        });

        try {
            await patchUpdateUser(payload);
            await getUserInfo(false);

            
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
            setStatus({ type: 'success', message: 'Data was updated' });
        } catch (error: any) {

            await handleApiError(error);
            setStatus({ type: 'error', message: fieldErrors?.global || 'Data not updated' });
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Profile settings</h2>

                {status.type && (
                    <div className={status.type === 'error' ? styles.error : styles.success}>
                        <p>{status.message}</p>
                    </div>
                )}

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Personal data</h3>
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName">First name</label>
                        <input id="firstName" name="firstName" type="text" value={formData?.firstName} onChange={handleChange} className={styles.input} />
                        {fieldErrors.firstName && <span className="error">{fieldErrors.firstName}</span>}
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName">Last name</label>
                        <input id="lastName" name="lastName" type="text" value={formData?.lastName} onChange={handleChange} className={styles.input} />
                        {fieldErrors.lastName && <span className="error">{fieldErrors.lastName}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" value={formData?.email} onChange={handleChange} className={styles.input} />
                        {fieldErrors.email && <span className="error">{fieldErrors.email}</span>}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Password change (optional)</h3>
                    <div className={styles.inputGroup}>
                        <label htmlFor="currentPassword">Current password</label>
                        <input id="currentPassword" name="currentPassword" type="password" value={formData?.currentPassword} onChange={handleChange} className={styles.input} />
                        {fieldErrors.currentPassword && <span className="error">{fieldErrors.currentPassword}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="newPassword">New password</label>
                        <input id="newPassword" name="newPassword" type="password" value={formData?.newPassword} onChange={handleChange} className={styles.input} />
                        {fieldErrors.newPassword && <span className="error">{fieldErrors.newPassword}</span>}
                    </div>
                </div>

                <button type="submit" className={styles.button}>Save changes !</button>
            </form>
        </div>
    );
}