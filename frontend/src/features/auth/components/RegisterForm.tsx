import { Mail, User, CalendarIcon, Lock } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { AppDatePicker } from '../../../components/common/AppDatePicker';
import { PasswordInput, PasswordStrengthIndicator, usePasswordStrength } from './PasswordInput';

export const RegisterForm = () => {
    const {
        formData,
        termsAccepted,
        error,
        handleChange,
        handleDateChange,
        handleCheckboxChange,
        handleSubmit
    } = useRegisterForm();

    const{ isPasswordStrong} = usePasswordStrength(formData.password || "");

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="firstName">First name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Filip"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Wiecha"
                        required
                    />
                </div>
            </div>

            <div className="input-group">
                <label htmlFor="email">Birth date</label>
                <div className="input-with-icon">
                    <CalendarIcon className="icon-left" size={18} />
                        <div tabIndex={0} className='divInput'>
                            <AppDatePicker
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleDateChange}
                                isRequired
                            /> 
                        </div>
                </div>
            </div>


            <div className="input-group">
                <label htmlFor="email">E-mail address</label>
                <div className="input-with-icon">
                    <Mail className="icon-left" size={18} />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="filipwiecha@wp.pl"
                        required
                    />
                </div>
                <span className="input-hint">We will send a confirmation link to this address.</span>
            </div>

            <div className="input-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                    <User className="icon-left" size={18} />
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="ajgorinho"
                        required
                    />
                </div>
            </div>

            <div className="input-group password-group">
                <label htmlFor="password">Password</label>
                <div className={`input-with-icon ${isPasswordStrong ? 'valid' : ''}`}>
                    <Lock className="icon-left" size={18} />
                    <PasswordInput 
                        name={"password"}
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
 
            </div>

            <div className={`divPassword ${formData.password.length > 0 ? "show" : ""}`}>
                <PasswordStrengthIndicator password={formData.password || ""} />
            </div>

            <div className="form-options">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleCheckboxChange}
                    />
                    I accept the Terms of Use and Privacy Policy.
                </label>
            </div>

            <button type="submit" className="submit-btn">
                Create an account
            </button>
        </form>
    );
};