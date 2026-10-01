import { useEffect, useState } from "react";
import { getUserInfo } from "../../../api/user/UserService";
import type UserDto from "../../../api/user/Dto/UserDto";
import styles from "./UserProfile.module.css";

export const UserProfile = () => {
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
        return <div className={styles.center}>Loading...</div>;
    }

    if (isError) {
        return <div className={styles.error}>Error: {errorMessage}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>User profile</h2>
                <ul className={styles.list}>
                    <li><strong>Username:</strong> <span>{user?.username}</span></li>
                    <li><strong>First name:</strong> <span>{user?.firstName}</span></li>
                    <li><strong>Last name:</strong> <span>{user?.lastName}</span></li>
                    <li><strong>Email:</strong> <span>{user?.email}</span></li>
                    <li><strong>Birth date:</strong> <span>{user?.birthDate}</span></li>
                    <li><strong>Role:</strong> <span>{user?.role}</span></li>
                </ul>
            </div>
        </div>
    );
};