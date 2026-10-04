import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { disableTotp } from '../../auth/services/AuthService';

interface TotpDisableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function TotpDisableModal({ isOpen, onClose, onSuccess }: TotpDisableModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCode('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDisable = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await disableTotp(code);
            onSuccess();
            onClose();
        } catch {
            setError('Nieprawidłowy kod weryfikacyjny.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '380px' }}>
                <h3>Wyłącz 2FA</h3>
                <p>Wprowadź obecny 6-cyfrowy kod z aplikacji uwierzytelniającej, aby potwierdzić dezaktywację weryfikacji dwuetapowej.</p>

                <div className="input-group">
                    <label htmlFor="totpDisableCode">Kod z aplikacji</label>
                    <div className="input-with-icon">
                        <Smartphone className="icon-left" size={18} />
                        <input
                            id="totpDisableCode"
                            type="text"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="000 000"
                            autoFocus
                        />
                    </div>
                </div>

                {error && <div className="error-message" style={{ margin: '16px 0' }}>{error}</div>}

                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>
                        Anuluj
                    </button>
                    <button type="button" onClick={handleDisable} className="btn-danger" disabled={isLoading || code.length !== 6}>
                        {isLoading ? "Przetwarzanie..." : "Wyłącz 2FA"}
                    </button>
                </div>
            </div>
        </div>
    );
}