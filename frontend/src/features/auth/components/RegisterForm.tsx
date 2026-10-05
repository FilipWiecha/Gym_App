import { Mail, User, CalendarIcon, Lock } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { AppDatePicker } from '../../../components/common/AppDatePicker';
import { PasswordInput, PasswordStrengthIndicator } from './PasswordInput';
import { ErrorSpan } from './ErrorSpan';

export const RegisterForm = () => {
    const {
        formData,
        formError,
        isPasswordStrong,
        handleChange,
        handleDateChange,
        handleCheckboxChange,
        handleSubmit
    } = useRegisterForm();

    return (
        <form onSubmit={handleSubmit} className="login-form">

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
                    <ErrorSpan error={formError?.firstName}/>
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
                    <ErrorSpan error={formError?.lastName}/>
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
                <ErrorSpan error={formError?.birthDate}/>
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
                <ErrorSpan error={formError?.email}/>
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
                <ErrorSpan error={formError?.username}/>
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
                <ErrorSpan error={formError?.password}/>
            </div>

            <div className={`divPassword ${formData.password.length > 0 ? "show" : ""}`}>
                <PasswordStrengthIndicator password={formData.password || ""} />
            </div>


            <div className="form-options">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        onChange={handleCheckboxChange}
                    />
                    I accept the Terms of Use and Privacy Policy.
                </label>
                <ErrorSpan error={formError?.termsAccepted}/>
            </div>
                



            <button type="submit" className="submit-btn">
                Create an account
            </button>
        </form>
    );
};