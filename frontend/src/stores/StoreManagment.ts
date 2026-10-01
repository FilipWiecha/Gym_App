import { setHasSession } from "./AuthStore";
import { clearUserInfoStore } from "./UserStore";

export const clearAllStores = () => {
    clearUserInfoStore();
    setHasSession(false);
};