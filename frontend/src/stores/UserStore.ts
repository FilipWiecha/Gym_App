import type UserDto from "../api/user/Dto/UserDto"

export const getUserInfoStore = (): UserDto | null =>{
    const data = sessionStorage.getItem("userInfoData");

    if(!data){
        return null;
    }

    return JSON.parse(data);
}

export const setUserInfoStore = (userData: UserDto) =>{
    sessionStorage.setItem("userInfoData", JSON.stringify(userData));
}

export const clearUserInfoStore = () => {
    sessionStorage.removeItem("userInfoData");
};