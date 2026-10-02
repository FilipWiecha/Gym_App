import { apiClient } from "../../../services/apiClient";


import type UserDto from "../types/UserDto";
import type { UserUpdateDto } from "../types/UserUpdateDto";


export const getUserInfo = async ():Promise<UserDto> =>{
    const USER_DETAILS_URL = import.meta.env.VITE_USER_DETAILS;
    const response = await apiClient.get<UserDto>(`${USER_DETAILS_URL}`,{withCredentials:false});

    return response.data;
}

export const patchUpdateUser = async (data: UserUpdateDto) => {
    const USER_UPDATE_ENDPOINT = import.meta.env.VITE_USER_UPDATE;

    const response = await apiClient.patch(`${USER_UPDATE_ENDPOINT}`, data);
    return response.data;
};