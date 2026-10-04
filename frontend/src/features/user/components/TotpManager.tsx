import { useState } from 'react';
import { Shield, Smartphone } from 'lucide-react';
import { setupTotp, enableTotp } from '../../auth/services/AuthService';
import type { TotpSetupResponse } from '../../auth/types/TotpDto';
import { useAuth } from '../../../context/AuthContext';
import { TotpDisableModal } from './TotpDisableModal';

export function TotpManager() {
    const { user, setUser } = useAuth();
    
    // Zabezpieczenie przed brakiem danych użytkownika w kontekście
    const [isTotpEnabled, setIsTotpEnabled] = useState(user?.totpEnabled || false);
    
    const [setupData, setSetupData] = useState<TotpSetupResponse | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

    const handleSetupInit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await setupTotp();
            setSetupData(data);
        } catch {
            setError('Błąd generowania kodu QR.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnable = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await enableTotp(verificationCode);
            setIsTotpEnabled(true);
            if (user) setUser({ ...user, totpEnabled: true });
            
            setSetupData(null);
            setVerificationCode('');
        } catch {
            setError('Nieprawidłowy kod weryfikacyjny.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisableSuccess = () => {
        setIsTotpEnabled(false);
        if (user) setUser({ ...user, totpEnabled: false });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Shield size={20} color={isTotpEnabled ? "var(--color-success)" : "var(--color-text-light-muted)"} />
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-main)' }}>Uwierzytelnianie dwuetapowe (2FA)</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-light-muted)', marginTop: '2px' }}>
                        {isTotpEnabled ? 'Aktywne. Konto jest dodatkowo chronione.' : 'Dodaj aplikację uwierzytelniającą.'}
                    </div>
                </div>
            </div>
            
            {!isTotpEnabled && !setupData && (
                <button type="button" onClick={handleSetupInit} className="btn-secondary" disabled={isLoading}>
                    Włącz
                </button>
            )}

            {isTotpEnabled && (
                <button type="button" onClick={() => setIsDisableModalOpen(true)} className="btn-danger" disabled={isLoading}>
                    Wyłącz
                </button>
            )}

            {setupData && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '380px' }}>
                        <h3>Konfiguracja 2FA</h3>
                        <p>Zeskanuj poniższy kod QR w aplikacji uwierzytelniającej (np. Google Authenticator), a następnie przepisz wygenerowany kod.</p>
                        
                        <div style={{ textAlign: 'center', margin: '24px 0', background: 'white', padding: '16px', borderRadius: '8px' }}>
                            <img src={setupData.qrCodeUri} alt="Kod QR TOTP" style={{ width: '200px', height: '200px' }} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="totpConfirmCode">Kod z aplikacji</label>
                            <div className="input-with-icon">
                                <Smartphone className="icon-left" size={18} />
                                <input
                                    id="totpConfirmCode"
                                    type="text"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="000 000"
                                />
                            </div>
                        </div>

                        {error && <div className="error-message" style={{ margin: '16px 0' }}>{error}</div>}

                        <div className="modal-actions">
                            <button type="button" onClick={() => setSetupData(null)} className="btn-secondary" disabled={isLoading}>
                                Anuluj
                            </button>
                            <button type="button" onClick={handleEnable} className="btn-primary" disabled={isLoading || verificationCode.length !== 6}>
                                Aktywuj 2FA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TotpDisableModal 
                isOpen={isDisableModalOpen} 
                onClose={() => setIsDisableModalOpen(false)} 
                onSuccess={handleDisableSuccess} 
            />
        </div>
    );
}