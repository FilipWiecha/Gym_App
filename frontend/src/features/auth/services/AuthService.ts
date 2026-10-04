import axios from "axios";
import type RegisterDto from "../types/RegisterDto";
import type LoginDto from "../types/LoginDto";
import type TokenDto from "../types/TokenDto";
import { apiClient, setAccessToken } from "../../../services/apiClient";
import type { TotpSetupResponse } from "../types/TotpDto";


const BASE_URL = import.meta.env.VITE_URL_BASE_BACKEND;

export const postRegisterUser = async (
    registerData: RegisterDto
) => {

    const REGISTER_ENDPOINT = import.meta.env.VITE_ENDPOINT_AUTH_REGISTER;

    const response = await axios.post<string>(
        `${BASE_URL}${REGISTER_ENDPOINT}`,
        registerData
    )

    return response.data;
};

export const postLoginUser = async (loginData: LoginDto): Promise<TokenDto> => {
    const LOGIN_ENDPOINT = import.meta.env.VITE_ENDPOINT_AUTH_LOGIN;
    try {
        const response = await axios.post<TokenDto>(
            `${BASE_URL}${LOGIN_ENDPOINT}`, 
            loginData,
            { withCredentials: true }
        );
        setAccessToken(response.data?.accessToken || null);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 428) {
            throw new Error('TOTP_REQUIRED');
        }
        if (error.response?.status === 401 && error.response?.data === 'INVALID_TOTP_CODE') {
            throw new Error('INVALID_TOTP_CODE');
        }
        throw error;
    }
};

export const postLogOutUser = async () => {
    const LOGOUT_ENDPOINT = import.meta.env.VITE_ENDPOINT_AUTH_LOGOUT;
    await apiClient.post<String>(LOGOUT_ENDPOINT, null, {withCredentials:true});
};

export const postRefreshToken = async ():Promise<TokenDto> => {
    const REFRESH_ENDPOINT = import.meta.env.VITE_ENDPOINT_AUTH_REFRESH;
    const response = await axios.post<TokenDto>(
        `${BASE_URL}${REFRESH_ENDPOINT}`, 
        {}, 
        { withCredentials: true }
    );
    
    return response.data || null;
};

export const setupTotp = async (): Promise<TotpSetupResponse> => {
    const TOTP_SETUP_ENDPOINT = import.meta.env.VITE_ENDPOINT_TOTP_SETUP;
    const response = await apiClient.post<TotpSetupResponse>(TOTP_SETUP_ENDPOINT);
    return response.data;
};

export const enableTotp = async (code: string): Promise<void> => {
    const TOTP_ENABLE_ENDPOINT = import.meta.env.VITE_ENDPOINT_TOTP_ENABLE;
    await apiClient.post(TOTP_ENABLE_ENDPOINT, { code });
};

export const disableTotp = async (code: string): Promise<void> => {
    const TOTP_DISABLE_ENDPOINT = import.meta.env.VITE_ENDPOINT_TOTP_DISABLE;
    await apiClient.post(TOTP_DISABLE_ENDPOINT, { code });
};


