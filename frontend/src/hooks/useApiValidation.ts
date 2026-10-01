import { useState } from 'react';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../api/ApiErrorResponse';


export const useApiValidation = () => {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>('');

    const handleApiError = (error: unknown) => {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const data = axiosError.response?.data;

        if (data?.errors) {
            setFieldErrors(data.errors);
        } else {
            setFieldErrors({});
        }

        setGeneralError(data?.detail || axiosError.message || 'Connection error');
    };

    const clearErrors = () => {
        setFieldErrors({});
        setGeneralError('');
    };

    return { fieldErrors, generalError, handleApiError, clearErrors };
};