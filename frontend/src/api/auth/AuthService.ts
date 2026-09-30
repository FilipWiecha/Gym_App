import { apiClient, setAccessToken } from "../apiClient";
import type LoginDto from "./dto/LoginDto";
import type RegisterDto from "./dto/RegisterDto";
import type TokenDto from "./dto/TokenDto";


export const postRegisterUser = async (
    registerData: RegisterDto
) => {

    const REGISTER_ENDPOINT = import.meta.env.VITE_URL_REGISTER;

    const response = await apiClient.post<string>(REGISTER_ENDPOINT, registerData);
    return response;
};


export const postLoginUser = async (
    loginData: LoginDto
) =>{

    const LOGIN_ENDPOINT = import.meta.env.VITE_URL_LOGIN;

    const respone = await apiClient.post<TokenDto>(LOGIN_ENDPOINT, loginData);
    setAccessToken(respone.data?.accessToken || null);

    return respone;
};

