import { CheckCircle2 } from "lucide-react";
import type { UserUpdateDto } from "../types/UserUpdateDto";

interface ProfileDetailsCardProps {
    formData: UserUpdateDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fieldErrors: Record<string, string>;
}

export function ProfileDetailsCard({ formData, onChange, fieldErrors }: ProfileDetailsCardProps) {
    return (
        <div className="card-item">
            <div className="card-header">
                <h3>Dane osobowe</h3>
            </div>
            <p className="card-description">Zaktualizuj podstawowe informacje o swoim profilu.</p>

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="firstName">Imię</label>
                    <input 
                        id="firstName" 
                        name="firstName" 
                        type="text" 
                        value={formData?.firstName || ''} 
                        onChange={onChange} 
                    />
                    {fieldErrors.firstName && <span className="input-hint" style={{ color: 'var(--color-error-text)' }}>{fieldErrors.firstName}</span>}
                </div>
                
                <div className="input-group">
                    <label htmlFor="lastName">Nazwisko</label>
                    <input 
                        id="lastName" 
                        name="lastName" 
                        type="text" 
                        value={formData?.lastName || ''} 
                        onChange={onChange} 
                    />
                    {fieldErrors.lastName && <span className="input-hint" style={{ color: 'var(--color-error-text)' }}>{fieldErrors.lastName}</span>}
                </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="email">Adres email</label>
                <div className="input-with-icon">
                    <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData?.email || ''} 
                        onChange={onChange} 
                        style={{ paddingLeft: '16px' }} 
                    />
                    <div className="icons-right">
                        <CheckCircle2 className="icon-success" size={18} />
                    </div>
                </div>
                {fieldErrors.email && <span className="input-hint" style={{ color: 'var(--color-error-text)' }}>{fieldErrors.email}</span>}
            </div>
        </div>
    );
}