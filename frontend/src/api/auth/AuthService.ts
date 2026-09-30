import axios from "axios";

import { apiClient, setAccessToken } from "../apiClient";
import type LoginDto from "./dto/LoginDto";
import type RegisterDto from "./dto/RegisterDto";
import type TokenDto from "./dto/TokenDto";

const BASE_URL = import.meta.env.VITE_URL_BASE_BACKEND;


export const postRegisterUser = async (
    registerData: RegisterDto
) => {

    const REGISTER_ENDPOINT = import.meta.env.VITE_URL_REGISTER;

    const response = await axios.post<string>(
        `${BASE_URL}${REGISTER_ENDPOINT}`,
        registerData
    )

    return response.data;
};


export const postLoginUser = async (
    loginData: LoginDto
):Promise<TokenDto> =>{

    const LOGIN_ENDPOINT = import.meta.env.VITE_URL_LOGIN;

    const response = await axios.post<TokenDto>(
        `${BASE_URL}${LOGIN_ENDPOINT}`, 
        loginData,
        { withCredentials: true }
    );
    
    setAccessToken(response.data?.accessToken || null);

    return response.data;
};


export const postLogOutUser = async () => {
    const LOGOUT_ENDPOINT = import.meta.env.VITE_URL_LOGOUT;
    await apiClient.post<String>(LOGOUT_ENDPOINT);
    setAccessToken(null);
};

export const postRefreshToken = async ():Promise<TokenDto> => {
    const REFRESH_ENDPOINT = import.meta.env.VITE_URL_REFRESH_ACCESS_TOKEN;
    const response = await axios.post<TokenDto>(
        `${BASE_URL}${REFRESH_ENDPOINT}`, 
        {}, 
        { withCredentials: true }
    );
    
    return response.data || null;
};

