import { useEffect, useState } from "react";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { getActiveSessions, revokeSession } from "../services/UserService";
import type { UserSessionDto } from "../types/UserSessionDto";
import { ConfirmModal } from "../../../components/common/ConfirmModal";

export function ActiveSessionsManager() {
    const [sessions, setSessions] = useState<UserSessionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const data = await getActiveSessions();
            setSessions(data);
            setError(null);
        } catch {
            setError("Błąd pobierania aktywnych sesji.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await revokeSession(deleteId);
            await fetchSessions();
        } catch {
            setError("Nie udało się usunąć sesji.");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const getDeviceIcon = (userAgent: string) => {
        const ua = userAgent.toLowerCase();
        if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
            return <Smartphone size={24} color="var(--color-primary)" />;
        }
        return <Monitor size={24} color="var(--color-primary)" />;
    };

    return (
        <div className="card-item">
            <div className="card-header">
                <h3>Zalogowane urządzenia</h3>
            </div>
            <p className="card-description">Przeglądaj i zarządzaj aktywnymi urządzeniami, które mają dostęp do konta.</p>

            {error && <div className="error-message">{error}</div>}
            {isLoading && <div className="loading-state">Ładowanie sesji...</div>}

            {!isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sessions.map((session) => (
                        <div 
                            key={session.id} 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '16px', 
                                border: session.isCurrentSession ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', 
                                borderRadius: 'var(--radius-m)', 
                                background: 'rgba(255, 255, 255, 0.4)' 
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {getDeviceIcon(session.userAgent)}
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, fontSize: '14px', color: 'var(--color-text-main)' }}>
                                        {session.ipAddress} {session.isCurrentSession && <span style={{ color: 'var(--color-success)', fontSize: '12px', marginLeft: '8px' }}>(Obecna sesja)</span>}
                                    </p>
                                    <p style={{ margin: '0 0 4px 0', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                                        {session.userAgent.substring(0, 45)}{session.userAgent.length > 45 ? '...' : ''}
                                    </p>
                                    <p style={{ margin: 0, color: 'var(--color-text-light-muted)', fontSize: '12px' }}>
                                        Ostatnia aktywność: {new Date(session.lastActiveAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            {!session.isCurrentSession && (
                                <button 
                                    type="button"
                                    onClick={() => setDeleteId(session.id)}
                                    className="icon-btn"
                                    title="Wyloguj urządzenie"
                                    style={{ color: 'var(--color-error-text)' }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal 
                isOpen={!!deleteId}
                title="Wylogowanie urządzenia"
                message="Czy na pewno chcesz usunąć tę sesję? Urządzenie będzie wymagało ponownego zalogowania."
                onConfirm={handleRevoke}
                onCancel={() => setDeleteId(null)}
                isLoading={isDeleting}
                confirmText="Wyloguj"
            />
        </div>
    );
}