import type RegisterDto from '../types/RegisterDto';

export type RegisterErrors = Record<string, string>;

const MIN_AGE = 13;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const NAME_REGEX = /^\p{L}[\p{L}\s'-]*$/u;
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

type Validator = (value: string) => string | undefined;

const validateName =
    (label: string): Validator =>
    (value) => {
        const v = value.trim();
        if (!v) return `${label} is required`;
        if (v.length < 2) return `${label} must be at least 2 characters`;
        if (v.length > 50) return `${label} can have at most 50 characters`;
        if (!NAME_REGEX.test(v)) return `${label} contains invalid characters`;
    };

const validators: Record<keyof RegisterDto, Validator> = {
    username: (value) => {
        const v = value.trim();
        if (!v) return 'Username is required';
        if (v.length < 3) return 'Username must be at least 3 characters';
        if (v.length > 20) return 'Username can have at most 20 characters';
        if (!USERNAME_REGEX.test(v)) return 'Only letters, digits and _ are allowed';
    },

    password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (value.length > 64) return 'Password can have at most 64 characters';
        if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
        if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
        if (!/\d/.test(value)) return 'Password must contain a digit';
    },

    email: (value) => {
        const v = value.trim();
        if (!v) return 'Email is required';
        if (!EMAIL_REGEX.test(v)) return 'Enter a valid email address';
    },

    firstName: validateName('First name'),
    lastName: validateName('Last name'),

    birthDate: (value) => {
        if (!value) return 'Please select your birth date.';

        const match = DATE_REGEX.exec(value);
        if (!match) return 'Use the YYYY-MM-DD format';

        const [year, month, day] = match.slice(1).map(Number);
        const date = new Date(year, month - 1, day);

        // rejects e.g. 2024-02-31
        const isRealDate =
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;
        if (!isRealDate) return 'This date does not exist';

        const today = new Date();
        if (date > today) return 'Birth date cannot be in the future';

        let age = today.getFullYear() - year;
        const hadBirthday =
            today.getMonth() > month - 1 ||
            (today.getMonth() === month - 1 && today.getDate() >= day);
        if (!hadBirthday) age--;

        if (age < MIN_AGE) return `You must be at least ${MIN_AGE} years old`;
        if (age > 120) return 'Enter a valid birth date';
    },
};

const validateField = (field: string, value: string): string | undefined =>
    validators[field as keyof RegisterDto]?.(value);

const validateAll = (values: RegisterDto): RegisterErrors => {
    const errors: RegisterErrors = {};

    (Object.keys(validators) as (keyof RegisterDto)[]).forEach((field) => {
        const error = validators[field](values[field] ?? '');
        if (error) errors[field] = error;
    });

    return errors;
};

/**
 * Stateless: the form hook owns the error state, so API errors
 * and client-side errors live in one place.
 */
export default function useRegisterValidation() {
    return { validateField, validateAll };
}