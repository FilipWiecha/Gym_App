import axios, { type AxiosResponse } from "axios";
import type TokenDto from "./auth/dto/TokenDto";


let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;


export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_URL_BASE_BACKEND,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));


let isRefreshing = false;
let failedQueue: Array<{resolve: Function, reject: Function}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
        
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers.Authorization = 'Bearer ' + token;
                return apiClient(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {

            const response: AxiosResponse<TokenDto> = await axios.post(
                `${import.meta.env.VITE_URL_BASE_BACKEND}${import.meta.env.VITE_URL_REFRESH_ACCESS_TOKEN}`,
                {},
                { withCredentials: true }
            );


            const newAccessToken = response.data?.accessToken;
            setAccessToken(newAccessToken);


            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {

            processQueue(refreshError, null);
            setAccessToken(null);
            

            window.location.href = '/login';
            
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
});