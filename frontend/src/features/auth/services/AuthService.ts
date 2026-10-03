import axios from "axios";
import type RegisterDto from "../types/RegisterDto";
import type LoginDto from "../types/LoginDto";
import type TokenDto from "../types/TokenDto";
import { apiClient, setAccessToken } from "../../../services/apiClient";




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


export const postLoginUser = async (
    loginData: LoginDto
):Promise<TokenDto> =>{

    const LOGIN_ENDPOINT = import.meta.env.VITE_ENDPOINT_AUTH_LOGIN;

    const response = await axios.post<TokenDto>(
        `${BASE_URL}${LOGIN_ENDPOINT}`, 
        loginData,
        { withCredentials: true }
    );
    
    setAccessToken(response.data?.accessToken || null);

    return response.data;
};


export const postLogOutUser = async () => {
    const LOGOUT_ENDPOINT = import.meta.env.VITE_ENDPOINT_AUTH_LOGOUT;
    await apiClient.post<String>(LOGOUT_ENDPOINT);
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

