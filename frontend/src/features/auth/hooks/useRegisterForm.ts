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
    //const { errors, validateField, validateAll } = useRegisterValidation();

    const [formData, setFormData] = useState<RegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: ''
    });
    const{ isPasswordStrong } = usePasswordStrength(formData.password || "")
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formError, setFormError] = useState<Record<string, string> | null >(null);
    const [generalFormError, setGeneralFormError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

        setFormError((prev) => {
            const { [e.target.name]: _, ...rest } = prev ?? {};
            return rest;
        });
    };

    const handleDateChange = (birthDate: string) => {
        setFormData((prev) => ({
            ...prev,
            birthDate
        }));

        setFormError((prev) => {
            const { ["birthDate"]: _, ...rest } = prev ?? {};
            return rest;
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(e.target.checked);

        setFormError((prev) => {
                const { ["termsAccepted"]: _, ...rest } = prev ?? {};
                return rest;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        let isError = false;

        if (!termsAccepted) {
            setFormError(e=>({...e,"termsAccepted": "You must accept the terms of use."}));
            isError = true;
        }

        if (!formData.birthDate) {
            setFormError(e=>({...e,"birthDate": "Please select your birth date."}));
            isError = true;
        }

        if(!isPasswordStrong){
            setFormError(e=>({...e,"password": "Please setup strong password"}));
            isError = true;
        }

        if(isError || !formError) return;

        try {
            
            await postRegisterUser(formData);
            navigate('/login');
        } catch (err: any) {
            const {fieldErrors, generalError} = handleApiError(err);
            
            setGeneralFormError(generalError);
            setFormError(e=>({ ...e, ...fieldErrors}));
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
        handleSubmit
    };
};