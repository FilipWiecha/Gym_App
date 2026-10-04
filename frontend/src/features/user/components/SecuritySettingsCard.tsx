import type { UserUpdateDto } from "../types/UserUpdateDto";

interface SecuritySettingsCardProps {
    formData: UserUpdateDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fieldErrors: Record<string, string>;
}

export function SecuritySettingsCard({ formData, onChange, fieldErrors }: SecuritySettingsCardProps) {
    return (
        <div className="card-item">
            <div className="card-header">
                <h3>Bezpieczeństwo i Hasło</h3>
            </div>
            <p className="card-description">Zmień swoje hasło, aby zabezpieczyć konto.</p>

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

            <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="newPassword">Nowe hasło</label>
                <input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    value={formData?.newPassword || ''} 
                    onChange={onChange} 
                    placeholder="Wprowadź nowe hasło"
                />
                {fieldErrors.newPassword && <span className="input-hint" style={{ color: 'var(--color-error-text)' }}>{fieldErrors.newPassword}</span>}
            </div>
        </div>
    );
}