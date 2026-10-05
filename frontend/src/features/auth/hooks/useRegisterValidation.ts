import { useCallback, useState } from "react";
import type RegisterDto from "../types/RegisterDto";


export type RegisterErrors = Partial<Record<keyof RegisterDto, string>>;

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
    if (!v) return `${label} jest wymagane`;
    if (v.length < 2) return `${label} musi mieć min. 2 znaki`;
    if (v.length > 50) return `${label} może mieć maks. 50 znaków`;
    if (!NAME_REGEX.test(v)) return `${label} zawiera niedozwolone znaki`;
  };

const validators: Record<keyof RegisterDto, Validator> = {
  username: (value) => {
    const v = value.trim();
    if (!v) return "Nazwa użytkownika jest wymagana";
    if (v.length < 3) return "Nazwa użytkownika musi mieć min. 3 znaki";
    if (v.length > 20) return "Nazwa użytkownika może mieć maks. 20 znaków";
    if (!USERNAME_REGEX.test(v))
      return "Dozwolone są tylko litery, cyfry i znak _";
  },

  password: (value) => {
    if (!value) return "Hasło jest wymagane";
    if (value.length < 8) return "Hasło musi mieć min. 8 znaków";
    if (value.length > 64) return "Hasło może mieć maks. 64 znaki";
    if (!/[a-z]/.test(value)) return "Hasło musi zawierać małą literę";
    if (!/[A-Z]/.test(value)) return "Hasło musi zawierać wielką literę";
    if (!/\d/.test(value)) return "Hasło musi zawierać cyfrę";
  },

  email: (value) => {
    const v = value.trim();
    if (!v) return "Email jest wymagany";
    if (!EMAIL_REGEX.test(v)) return "Podaj poprawny adres email";
  },

  firstName: validateName("Imię"),
  lastName: validateName("Nazwisko"),

  birthDate: (value) => {
    if (!value) return "Data urodzenia jest wymagana";

    const match = DATE_REGEX.exec(value);
    if (!match) return "Użyj formatu RRRR-MM-DD";

    const [year, month, day] = match.slice(1).map(Number);
    const date = new Date(year, month - 1, day);

    // odrzuca np. 2024-02-31
    const isRealDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
    if (!isRealDate) return "Podana data nie istnieje";

    const today = new Date();
    if (date > today) return "Data urodzenia nie może być z przyszłości";

    let age = today.getFullYear() - year;
    const hadBirthday =
      today.getMonth() > month - 1 ||
      (today.getMonth() === month - 1 && today.getDate() >= day);
    if (!hadBirthday) age--;

    if (age < MIN_AGE) return `Musisz mieć co najmniej ${MIN_AGE} lat`;
    if (age > 120) return "Podaj poprawną datę urodzenia";
  },
};

export default function useRegisterValidation() {
  const [errors, setErrors] = useState<RegisterErrors>({});

  /** Waliduje jedno pole (np. onBlur). Zwraca true, jeśli pole jest poprawne. */
  const validateField = useCallback(
    <K extends keyof RegisterDto>(field: K, value: RegisterDto[K]): boolean => {
      const error = validators[field](value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[field] = error;
        else delete next[field];
        return next;
      });
      return !error;
    },
    []
  );

  /** Waliduje cały formularz (np. przed submitem). Zwraca true, jeśli wszystko OK. */
  const validateAll = useCallback((values: RegisterDto): boolean => {
    const nextErrors: RegisterErrors = {};

    (Object.keys(validators) as (keyof RegisterDto)[]).forEach((field) => {
      const error = validators[field](values[field] ?? "");
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);

  const clearError = useCallback((field: keyof RegisterDto) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const resetErrors = useCallback(() => setErrors({}), []);

  return { errors, validateField, validateAll, clearError, resetErrors };
}