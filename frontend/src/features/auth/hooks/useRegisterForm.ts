import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type RegisterDto from '../types/RegisterDto';
import { postRegisterUser } from '../services/AuthService';

export const useRegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleDateChange = (birthDate: string) => {
        setFormData((prev) => ({
            ...prev,
            birthDate
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(e.target.checked);
    };

    const isLengthValid = formData.password.length >= 8;
    const hasNumber = /\d/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    const isPasswordStrong = isLengthValid && hasNumber && hasSpecial;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!termsAccepted) {
            setError('You must accept the terms of use.');
            return;
        }

        if (!formData.birthDate) {
            setError('Please select your birth date.');
            return;
        }

        try {
            await postRegisterUser(formData);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Rejestracja nie powiodła się.');
        }
    };

    return {
        formData,
        termsAccepted,
        error,
        isLengthValid,
        hasNumber,
        hasSpecial,
        isPasswordStrong,
        handleChange,
        handleDateChange,
        handleCheckboxChange,
        handleSubmit
    };
};