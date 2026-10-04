import { useEffect, useState } from "react";

import styles from "./ProfilePage.module.css";
import type UserDto from "../../../features/user/types/UserDto";
import { getUserInfo } from "../../../features/user/services/UserService";
import { PageLayout } from "../../../components/layout/PageLayout";

const getInitials = (user: UserDto) => {
    const letters = `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`;
    return (letters || user.username?.charAt(0) || "?").toUpperCase();
};

export function ProfilePage() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;

        getUserInfo()
            .then(data => {
                if (cancelled) return;
                setUser(data);
            })
            .catch(() => !cancelled && setError("Nie udało się wczytać profilu. Odśwież stronę."))
            .finally(() => !cancelled && setIsLoading(false));

        return () => { cancelled = true; };
    }, []);

    // Komunikat o zapisie znika sam
    useEffect(() => {
        if (!saved) return;
        const id = setTimeout(() => setSaved(false), 3000);
        return () => clearTimeout(id);
    }, [saved]);


    return (
        <PageLayout>
            <div className={styles.content}>
                <div className="top-nav">
                    <div className="form-header">
                        <h2>Profil</h2>
                        <p>Twoje dane i ustawienia konta.</p>
                    </div>
                </div>

                {isLoading && <p>Ładowanie...</p>}
                {error && <div className="error-message">{error}</div>}

                {user && (
                    <>
                        <section className={`${styles.panel} ${styles.hero}`}>
                            <div className={styles.avatar} aria-hidden="true">{getInitials(user)}</div>
                            <div className={styles.heroText}>
                                <p className={styles.name}>
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className={styles.username}>@{user.username}</p>
                            </div>
                            <span className={styles.badge}>{user.role?.replace("ROLE_", "").toLowerCase()}</span>
                        </section>

                        <section className={styles.panel}>
                            <h3 className={styles.panelTitle}>Konto</h3>
                            <div className="read-only-field">
                                <div className="read-only-label">Login</div>
                                <p className="read-only-value">{user.username}</p>
                            </div>
                            <div className={`read-only-field ${styles.readOnlyLast}`}>
                                <div className="read-only-label">E-mail</div>
                                <p className="read-only-value">{user.email}</p>
                            </div>
                            <div className={`read-only-field ${styles.readOnlyLast}`}>
                                <div className="read-only-label">Data urodzenia</div>
                                <p className="read-only-value">{user.birthDate}</p>
                            </div>
                        </section>

                        
                    </>
                )}
            </div>
        </PageLayout>
    );
}
