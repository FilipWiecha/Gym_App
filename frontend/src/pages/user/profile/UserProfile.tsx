import { useEffect, useState } from "react";
import { getUserInfo } from "../../../api/user/UserService";
import type UserDto from "../../../api/user/Dto/UserDto";
import styles from "./UserProfile.module.css";
import { 
    Mail,  
    ArrowRight,
    Calendar1Icon
} from "lucide-react";

export function UserProfilePage(){
    const [user, setUser] = useState<UserDto>();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await getUserInfo();
                setUser(response);
                setIsError(false);
                setErrorMessage("");
            } catch (error: any) {
                setErrorMessage(error.message || "Błąd pobierania danych użytkownika");
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, []);

    if (isLoading) {
        return <div className={styles.center}>Ładowanie...</div>;
    }

    if (isError) {
        return <div className={styles.error}>Błąd: {errorMessage}</div>;
    }

    
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`;
    const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
    const role = `${user?.role === "ROLE_ADMIN" ? "Admin": "Deafult user"}`

    return (
        <div className={styles.appLayout}>
            
            <main className={styles.mainContent}>
                
                <header className={styles.topHeader}>
                    <div>
                        <h1>Your profile</h1>
                    </div>
                </header>

                
                <div className={styles.dashboardGrid}>
                    <div className={styles.columnLeft}>
                        <div className={styles.card}>
                            
                            <div className={styles.profileAvatarSection}>
                                <div className={styles.largeAvatar}>{initials}</div>
                                <h2>{fullName}</h2>
                                <span className={styles.userRoleTitle}>{role}</span>
                            </div>

                            <ul className={styles.contactList}>
                                <li>
                                    <Mail size={16} />
                                    <span>{user?.email || ''}</span>
                                </li>

                                <li>
                                    <Calendar1Icon size={16} />
                                    <span>{user?.birthDate || ''}</span>
                                </li>
                            </ul>

                        </div>
                    </div>

                    
                    <div className={styles.columnRight}>               
                        
                        <div className={styles.card}>
                            <div className={styles.cardHeaderFlex}>
                                <div>
                                    <h3>Workouts</h3>
                                    <p className={styles.aboutSub}>your personal workouts</p>
                                </div>
                                <a href="#view-all" className={styles.viewAllLink}>
                                    View all <ArrowRight size={14} />
                                </a>
                            </div>

                            <div className={styles.workTable}>
                                <div className={styles.workRow}>
                                    <div className={styles.workInfo}>
                                        <span className={`${styles.workIcon} ${styles.bgBlue}`}>C</span>
                                        <div>
                                            <span className={styles.workTitle}>Workout Ttitle</span>
                                            <span className={styles.workCategory}>Workout desc</span>
                                        </div>
                                    </div>
                                    <div className={styles.workMeta}>
                                        <span className={styles.badgeOwner}>Time</span>
                                        <span className={styles.workProgress}>Details</span>
                                    </div>
                                </div>
  
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeaderFlex}>
                                <div>
                                    <h3>Training plans</h3>
                                    <p className={styles.aboutSub}>your personal training plans</p>
                                </div>
                                <a href="#view-all" className={styles.viewAllLink}>
                                    View all <ArrowRight size={14} />
                                </a>
                            </div>

                            <div className={styles.workTable}>
                                <div className={styles.workRow}>
                                    <div className={styles.workInfo}>
                                        <span className={`${styles.workIcon} ${styles.bgBlue}`}>C</span>
                                        <div>
                                            <span className={styles.workTitle}>plans Ttitle</span>
                                            <span className={styles.workCategory}>plans desc</span>
                                        </div>
                                    </div>
                                    <div className={styles.workMeta}>
                                        <span className={styles.badgeOwner}>Time</span>
                                        <span className={styles.workProgress}>Details</span>
                                    </div>
                                </div>
  
                            </div>
                        </div>


                        <div className={styles.card}>
                            <div className={styles.cardHeaderFlex}>
                                <div>
                                    <h3>Exercises</h3>
                                    <p className={styles.aboutSub}>your personal Exercises</p>
                                </div>
                                <a href="#view-all" className={styles.viewAllLink}>
                                    View all <ArrowRight size={14} />
                                </a>
                            </div>

                            <div className={styles.workTable}>
                                <div className={styles.workRow}>
                                    <div className={styles.workInfo}>
                                        <span className={`${styles.workIcon} ${styles.bgBlue}`}>C</span>
                                        <div>
                                            <span className={styles.workTitle}>Exercises Ttitle</span>
                                            <span className={styles.workCategory}>Exercises desc</span>
                                        </div>
                                    </div>
                                    <div className={styles.workMeta}>
                                        <span className={styles.badgeOwner}>Time</span>
                                        <span className={styles.workProgress}>Details</span>
                                    </div>
                                </div>
  
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}