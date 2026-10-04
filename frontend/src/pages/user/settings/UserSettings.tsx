import { useState } from 'react';

import styles from './UserSettings.module.css';

import { useAuth } from '../../../context/AuthContext';

import type { UserUpdateDto } from '../../../features/user/types/UserUpdateDto';
import { getUserInfo, patchUpdateUser } from '../../../features/user/services/UserService';

import { useApiValidation } from '../../../hooks/useApiValidation';

import { 
    Shield, 
    Check, 
    Key, 
    CheckCircle2 
} from 'lucide-react';

// Dokończyć ale pierw backend
export function UserSettingsPage() {
    const {setUser} = useAuth();

    const [formData, setFormData] = useState<UserUpdateDto>({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
    });
    
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const { fieldErrors, handleApiError, clearErrors } = useApiValidation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const userData = await getUserInfo();
            setUser(userData);

            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
            setStatus({ type: 'success', message: 'All changes saved' });
        } catch (error: any) {
            await handleApiError(error);
            setStatus({ type: 'error', message: fieldErrors?.global || 'Data not updated' });
        }
    };

    return (
        <div className={styles.appLayout}>

            
            <main className={styles.mainContent}>
                <form onSubmit={handleSubmit}>
                    
                    <header className={styles.topHeader}>
                        <div>
                            <h1>Profile settings</h1>
                            <p>Manage your account preferences</p>
                        </div>
                        <div className={styles.headerActions}>
                            {status.type === 'success' && (
                                <div className={styles.statusBadge}>
                                    <Check size={14} /> {status.message}
                                </div>
                            )}
                            <button type="submit" className={styles.saveBtn}>
                                Save changes
                            </button>
                        </div>
                    </header>

                    {status.type === 'error' && (
                        <div className={styles.errorBanner}>
                            <p>{status.message}</p>
                        </div>
                    )}

                
                        <div className={styles.settingsContent}>
                            
                            <div className={styles.card}>
                                <h3>Personal information</h3>
                                <p className={styles.cardSub}>Update profile details</p>

                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="firstName">First name</label>
                                        <input 
                                            id="firstName" 
                                            name="firstName" 
                                            type="text" 
                                            value={formData?.firstName || ''} 
                                            onChange={handleChange} 
                                            className={styles.input} 
                                        />
                                        {fieldErrors.firstName && <span className={styles.errorText}>{fieldErrors.firstName}</span>}
                                    </div>
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="lastName">Last name</label>
                                        <input 
                                            id="lastName" 
                                            name="lastName" 
                                            type="text" 
                                            value={formData?.lastName || ''} 
                                            onChange={handleChange} 
                                            className={styles.input} 
                                        />
                                        {fieldErrors.lastName && <span className={styles.errorText}>{fieldErrors.lastName}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="email">Email address</label>
                                        <div className={styles.inputWithIcon}>
                                            <input 
                                                id="email" 
                                                name="email" 
                                                type="email" 
                                                value={formData?.email || ''} 
                                                onChange={handleChange} 
                                                className={styles.input} 
                                            />
                                            <CheckCircle2 className={styles.iconSuccess} size={18} />
                                        </div>
                                        {fieldErrors.email && <span className={styles.errorText}>{fieldErrors.email}</span>}
                                    </div>

                                </div>


                            </div>
                            
                            
                            <div className={styles.card}>
                                <h3>Security</h3>
                                <p className={styles.cardSub}>Keep your account protected.</p>

                                <div className={styles.securityActionRow}>
                                    <div className={styles.securityInfo}>
                                        <Key size={18} />
                                        <div>
                                            <span className={styles.toggleTitle}>Password</span>
                                            <span className={styles.toggleDesc}>Last changed 38 days ago</span>
                                        </div>
                                    </div>
                                    <button type="button" className={styles.secondaryBtn}>Change</button>
                                </div>

                                <div className={styles.securityActionRow}>
                                    <div className={styles.securityInfo}>
                                        <Shield size={18} />
                                        <div>
                                            <span className={styles.toggleTitle}>Two-factor authentication</span>
                                            <span className={styles.toggleDesc}>Add an authenticator app for stronger security.</span>
                                        </div>
                                    </div>
                                    <button type="button" className={styles.secondaryBtn}>Enable</button>
                                </div>

                                <div className={styles.securityReviewRow}>
                                    <span className={styles.toggleDesc}>3 active sessions</span>
                                    <a href="#review" className={styles.reviewLink}>Review</a>
                                </div>
                            </div>
                            

                            
                            <div className={styles.cardDeactivate}>
                                <div>
                                    <h3>Deactivate account</h3>
                                    <p className={styles.cardSub}>Delete your account with all data</p>
                                </div>
                                <button type="button" className={styles.deactivateBtn}>Delete</button>
                            </div>
                        </div>
                    
                </form>
            </main>
        </div>
    );
}