import { apiClient } from "../apiClient";
import type LoginDto from "./dto/LoginDto";
import type RegisterDto from "./dto/RegisterDto";
import type TokenDto from "./dto/TokenDto";


export const postRegisterUser = (
    registerData: RegisterDto
) => {
    const REGISTER_ENDPOINT = import.meta.env.VITE_URL_REGISTER;
    return apiClient<string>(REGISTER_ENDPOINT, {
        method: "post",
        body: JSON.stringify(registerData)
    });
};


export const postLoginUser = (
    loginData: LoginDto
) =>{
    const LOGIN_ENDPOINT = import.meta.env.VITE_URL_LOGIN;
    return apiClient<TokenDto>(LOGIN_ENDPOINT, {
        method: "post",
        body: JSON.stringify(loginData)
    });
};

export const postRefreshToken = () => {
    const REFRESH_ENDPOINT = import.meta.env.VITE_URL_REFRESH_ACCESS_TOKEN;
    return apiClient<TokenDto>(REFRESH_ENDPOINT, {
        method: "post"
    });
}
