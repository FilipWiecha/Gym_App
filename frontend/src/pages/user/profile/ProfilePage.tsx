import { useEffect, useState } from "react";
import { Calendar, Loader2, Save, User } from "lucide-react";



import styles from "./ProfilePage.module.css";
import type UserDto from "../../../features/user/types/UserDto";
import { getUserInfo, patchUpdateUser } from "../../../features/user/services/UserService";
import type { UserUpdateDto } from "../../../features/user/types/UserUpdateDto";
import { PageLayout } from "../../../components/layout/PageLayout";
import { AppDatePicker } from "../../../components/common/AppDatePicker";

type ProfileForm = Pick<UserDto, "firstName" | "lastName" | "birthDate">;

const getInitials = (user: UserDto) => {
    const letters = `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`;
    return (letters || user.username?.charAt(0) || "?").toUpperCase();
};

export function ProfilePage() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [form, setForm] = useState<ProfileForm>({ firstName: "", lastName: "", birthDate: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;

        getUserInfo()
            .then(data => {
                if (cancelled) return;
                setUser(data);
                setForm({ firstName: data.firstName, lastName: data.lastName, birthDate: data.birthDate });
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

    const isDirty =
        !!user &&
        (form.firstName !== user.firstName ||
            form.lastName !== user.lastName ||
            form.birthDate !== user.birthDate);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError(null);
        setSaved(false);
        setIsSaving(true);

        try {
            await patchUpdateUser({
                firstName: form.firstName,
                lastName: form.lastName,
                birthDate: form.birthDate,
            } as UserUpdateDto);
            setUser({ ...user, ...form });
            setSaved(true);
        } catch {
            setError("Nie udało się zapisać zmian. Spróbuj ponownie.");
        } finally {
            setIsSaving(false);
        }
    };

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
                        </section>

                        <section className={styles.panel}>
                            <h3 className={styles.panelTitle}>Dane osobowe</h3>

                            <form onSubmit={handleSubmit}>
                                {saved && <div className="success-banner">Zapisano zmiany</div>}

                                <div className="form-row">
                                    <div className="input-group">
                                        <label htmlFor="firstName">Imię</label>
                                        <div className="input-with-icon">
                                            <User className="icon-left" size={18} />
                                            <input
                                                id="firstName"
                                                type="text"
                                                value={form.firstName}
                                                onChange={e => setForm({ ...form, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="lastName">Nazwisko</label>
                                        <div className="input-with-icon">
                                            <User className="icon-left" size={18} />
                                            <input
                                                id="lastName"
                                                type="text"
                                                value={form.lastName}
                                                onChange={e => setForm({ ...form, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="birthDate">Data urodzenia</label>
                                    <div className="input-with-icon">
                                        <Calendar className="icon-left" size={18} />
                                        <div className="divInput">
                                            <AppDatePicker
                                                name="birthDate"
                                                value={form.birthDate}
                                                onChange={birthDate => setForm({ ...form, birthDate })}
                                                placeholder="Wybierz datę"
                                                isRequired
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bottom-actions">
                                    <button type="submit" className="btn-primary" disabled={!isDirty || isSaving}>
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {isSaving ? "Przetwarzanie..." : "Zapisz zmiany"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </>
                )}
            </div>
        </PageLayout>
    );
}
