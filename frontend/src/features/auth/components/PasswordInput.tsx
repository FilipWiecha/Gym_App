import { useState, type ChangeEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react";

import styles from './PasswordInput.module.css';

type PasswordInputTypes = {
    name:string;
    value:string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const PasswordInput = ({name, value, onChange}:PasswordInputTypes) =>{

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const preventFocusLoss = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
    };

    return(
        <>
            <input
                id={name}
                name={name}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder="••••••••••"
                required
            />
            {!showPassword? (
                <Eye 
                    className="icon-right action" 
                    size={18} 
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={preventFocusLoss}
                    onTouchStart={preventFocusLoss}
                />
            ):(
                <EyeOff
                    className="icon-right action" 
                    size={18} 
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={preventFocusLoss}
                    onTouchStart={preventFocusLoss}
                />
            )}
        </>
    );
};


export const usePasswordStrength = (password: string) => {
    const hasUpperChar = /\p{Lu}/u.test(password);
    const isLengthValid = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isPasswordStrong = isLengthValid && hasNumber && hasSpecial && hasUpperChar;

    const barWidth = (
        (isLengthValid ? 1 : 0) + 
        (hasNumber ? 1 : 0) + 
        (hasSpecial ? 1 : 0) +
        (hasUpperChar? 1: 0)
    ) * 100 / 4;

    const getColor = () => {
        if (barWidth === 0) return "transparent";
        if (barWidth < 34) return "#ff3b30";
        if (barWidth < 67) return "#ff9500";
        return "#34c759";
    };

    return {
        isLengthValid,
        hasUpperChar,
        hasNumber,
        hasSpecial,
        isPasswordStrong,
        barWidth,
        getColor
    };
};

export const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const { isLengthValid, hasUpperChar, hasNumber, hasSpecial, barWidth, getColor } = usePasswordStrength(password);

    return (
        <div className={styles.divMain}>
            <div className={styles.barBorder}>
                <div 
                    className={styles.barDiv}
                    style={{
                        width: `${barWidth}%`,
                        backgroundColor: getColor()
                    }}
                />
            </div>

            <div className={`${styles.textDiv} ${barWidth >= 99 ? styles.hideBar : ""}`}>
                <p className={hasUpperChar ? styles.textGreen : styles.textBlack}>1 Duży znak</p>
                <p className={isLengthValid ? styles.textGreen : styles.textBlack}>8 znaków</p>
                <p className={hasNumber ? styles.textGreen : styles.textBlack}>1 cyfra</p>
                <p className={hasSpecial ? styles.textGreen : styles.textBlack}>1 znak specjalny</p>
            </div>  
        </div>
    );
};
