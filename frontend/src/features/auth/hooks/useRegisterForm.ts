import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type RegisterDto from '../types/RegisterDto';
import { postRegisterUser } from '../services/AuthService';
import { useApiValidation } from '../../../hooks/useApiValidation';
import { usePasswordStrength } from '../components/PasswordInput';
import useRegisterValidation from './useRegisterValidation';

export const useRegisterForm = () => {
    const navigate = useNavigate();
    const { handleApiError } = useApiValidation();
    const { validateField, validateAll } = useRegisterValidation();

    const [formData, setFormData] = useState<RegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: ''
    });
    const { isPasswordStrong } = usePasswordStrength(formData.password || "");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formError, setFormError] = useState<Record<string, string> | null>(null);
    const [generalFormError, setGeneralFormError] = useState<string | null>(null);

    const clearFieldError = (name: string) => {
        setFormError((prev) => {
            const { [name]: _, ...rest } = prev ?? {};
            return rest;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

        clearFieldError(e.target.name);
    };

    const handleDateChange = (birthDate: string) => {
        setFormData((prev) => ({
            ...prev,
            birthDate
        }));

        clearFieldError("birthDate");
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(e.target.checked);

        clearFieldError("termsAccepted");
    };

    // Optional: validates a single field when it loses focus (wire it to onBlur).
    const validateOnBlur = (name: string, value: string) => {
        const error = validateField(name, value);

        setFormError((prev) => {
            const { [name]: _, ...rest } = prev ?? {};
            return error ? { ...rest, [name]: error } : rest;
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
        validateOnBlur(e.target.name, e.target.value);

    // AppDatePicker calls onBlur without arguments, so the value comes from state.
    const handleDateBlur = () => validateOnBlur('birthDate', formData.birthDate);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralFormError(null);

        const errors: Record<string, string> = validateAll(formData);

        // password format is checked by validateAll; strength by the PasswordInput meter
        if (!errors.password && !isPasswordStrong) {
            errors.password = "Please setup strong password";
        }

        if (!termsAccepted) {
            errors.termsAccepted = "You must accept the terms of use.";
        }

        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }

        // send trimmed values so they match what the backend validates
        const payload: RegisterDto = {
            ...formData,
            username: formData.username.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim()
        };

        try {
            await postRegisterUser(payload);
            navigate('/login');
        } catch (err: any) {
            const { fieldErrors, generalError } = handleApiError(err);

            setGeneralFormError(generalError);
            setFormError((prev) => ({ ...prev, ...fieldErrors }));
        }
    };

    return {
        formData,
        termsAccepted,
        formError,
        generalFormError,
        isPasswordStrong,
        handleChange,
        handleDateChange,
        handleCheckboxChange,
        handleBlur,
        handleDateBlur,
        handleSubmit
    };
};