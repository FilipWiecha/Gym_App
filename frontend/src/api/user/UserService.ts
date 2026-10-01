import { getUserInfoStore, setUserInfoStore } from "../../stores/UserStore";
import { apiClient } from "../apiClient";
import type UserDto from "./Dto/UserDto";
import type { UserUpdateDto } from "./Dto/UserUpdateDto";

const BASE_URL = import.meta.env.VITE_URL_BASE_BACKEND;

export const getUserInfo = async (checkStore:boolean = true):Promise<UserDto> =>{
    const USER_DETAILS_URL = import.meta.env.VITE_USER_DETAILS;

    const userFromStore = getUserInfoStore();
    if(userFromStore && checkStore){
        return userFromStore;
    }

    const response = await apiClient.get<UserDto>(`${BASE_URL}${USER_DETAILS_URL}`,{withCredentials:false});
    setUserInfoStore(response.data);

    return response.data;
}

export const patchUpdateUser = async (data: UserUpdateDto) => {
    const USER_UPDATE_ENDPOINT = import.meta.env.VITE_USER_UPDATE;

    const response = await apiClient.patch(`${BASE_URL}${USER_UPDATE_ENDPOINT}`, data);
    return response.data;
};