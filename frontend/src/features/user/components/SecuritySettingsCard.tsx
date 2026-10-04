import { Lock } from "lucide-react";
import { PasswordInput, PasswordStrengthIndicator, usePasswordStrength } from "../../auth/components/PasswordInput";
import type { UserUpdateDto } from "../types/UserUpdateDto";
import { TotpManager } from "./TotpManager";


interface SecuritySettingsCardProps {
    formData: UserUpdateDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fieldErrors: Record<string, string>;
}

export function SecuritySettingsCard({ formData, onChange, fieldErrors }: SecuritySettingsCardProps) {
    const { isPasswordStrong } = usePasswordStrength(formData.newPassword || "");

    return (
        <div className="card-item">
            <div className="card-header">
                <h3>Bezpieczeństwo</h3>
            </div>
            <p className="card-description">Zarządzaj hasłem oraz dodatkowymi zabezpieczeniami konta.</p>

            {/* Sekcja zmiany hasła */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
                <div className="input-group">
                    <label htmlFor="currentPassword">Obecne hasło</label>
                    <input 
                        id="currentPassword" 
                        name="currentPassword" 
                        type="password" 
                        value={formData?.currentPassword || ''} 
                        onChange={onChange} 
                        placeholder="Wprowadź obecne hasło"
                    />
                    {fieldErrors.currentPassword && <span className="input-hint" style={{ color: 'var(--color-error-text)' }}>{fieldErrors.currentPassword}</span>}
                </div>

                <div className="input-group password-group">
                    <label htmlFor="newPassword">Nowe hasło</label>
                    <div className={`input-with-icon ${isPasswordStrong ? 'valid' : ''}`}>
                        <Lock className="icon-left" size={18} />
                        <PasswordInput
                            name={"newPassword"}
                            value={formData?.newPassword || ''}
                            onChange={onChange}
                        />
                        {fieldErrors.newPassword && <span className="input-hint" style={{ color: 'var(--color-error-text)' }}>{fieldErrors.newPassword}</span>}
                    </div>
                </div>
                <div className={`divPassword ${formData.newPassword ? "show" : ""}`}>
                    <PasswordStrengthIndicator password={formData.newPassword || ""} />
                </div>

            </div>

            {/* Sekcja weryfikacji dwuetapowej (TOTP) */}
            <TotpManager />
        </div>
    );
}