import { useState } from 'react';

import { Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import type { UserUpdateDto } from '../../../features/user/types/UserUpdateDto';
import { useApiValidation } from '../../../hooks/useApiValidation';
import { getUserInfo, patchUpdateUser } from '../../../features/user/services/UserService';
import { PageLayout } from '../../../components/layout/PageLayout';
import { ProfileDetailsCard } from '../../../features/user/components/ProfileDetailsCard';
import { SecuritySettingsCard } from '../../../features/user/components/SecuritySettingsCard';
import { ActiveSessionsManager } from '../../../features/user/components/ActiveSessionsManager';


;

export function UserSettingsPage() {
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState<UserUpdateDto>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
    });
    
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [isSaving, setIsSaving] = useState(false);
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
        setIsSaving(true);

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
            setStatus({ type: 'success', message: 'Wszystkie zmiany zostały zapisane' });
        } catch (error: any) {
            await handleApiError(error);
            setStatus({ type: 'error', message: fieldErrors?.global || 'Nie udało się zaktualizować danych' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PageLayout>
            <div className="form-wrapper" style={{ maxWidth: '740px' }}>
                
                {/* Własny Top Nav ze względu na przycisk Submit */}
                <div className="top-nav">
                    <div className="form-header" style={{ margin: 0 }}>
                        <h2 style={{ fontSize: '24px' }}>Ustawienia profilu</h2>
                        <p style={{ margin: '4px 0 0 0' }}>Zarządzaj swoim kontem i bezpieczeństwem</p>
                    </div>
                    
                    <div className="page-header-actions">
                        {status.type === 'success' && (
                            <span style={{ color: 'var(--color-success)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, marginRight: '12px' }}>
                                <Check size={16} /> {status.message}
                            </span>
                        )}
                        <button type="submit" form="settings-form" className="btn-primary" disabled={isSaving}>
                            {isSaving ? "Przetwarzanie..." : "Zapisz zmiany"}
                        </button>
                    </div>
                </div>

                {status.type === 'error' && (
                    <div className="error-message">
                        {status.message}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Główny formularz edycji obejmujący dwie karty */}
                    <form id="settings-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <ProfileDetailsCard 
                            formData={formData} 
                            onChange={handleChange} 
                            fieldErrors={fieldErrors} 
                        />
                        <SecuritySettingsCard 
                            formData={formData} 
                            onChange={handleChange} 
                            fieldErrors={fieldErrors} 
                        />
                    </form>

                    {/* Zarządzanie sesjami API niezależne od głównego formularza */}
                    <ActiveSessionsManager />
                    
                    {/* Strefa usunięcia konta */}
                    <div className="card-item" style={{ border: '1px solid rgba(255, 59, 48, 0.2)', backgroundColor: 'rgba(255, 59, 48, 0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, color: 'var(--color-text-main)' }}>Usuń konto</h3>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-light-muted)' }}>Trwale usuń swoje konto oraz wszystkie zapisane dane.</p>
                            </div>
                            <button type="button" className="btn-danger">Usuń konto</button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}