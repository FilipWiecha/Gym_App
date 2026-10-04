import { useState, type ChangeEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react";

import styles from './PasswordInput.module.css';

type PasswordInputTypes = {
    name:string;
    value:string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
};

type ShowPasswordStrengthTypes = {
        isLengthValid:boolean;
        hasNumber:boolean;
        hasSpecial:boolean;
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


export const ShowPasswordStrength = ({isLengthValid, hasNumber, hasSpecial}:ShowPasswordStrengthTypes) =>{

    const barWidth = ((isLengthValid ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0))*100/3;
    console.log(barWidth);
    const getColor = () => {
        if (barWidth === 0) return "transparent";
        if (barWidth < 34) return "#ff4d4d";
        if (barWidth < 67) return "#ffd700";
        return "#32cd32";
    };

    return(
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
                <p className={isLengthValid ? styles.textGreen : styles.textBlack}>8 znaków</p>
                <p className={hasNumber ? styles.textGreen : styles.textBlack}>1 cyfra</p>
                <p className={hasSpecial ? styles.textGreen : styles.textBlack}>1 znak specjalny</p>
            </div>  
        </div>
    );
}

