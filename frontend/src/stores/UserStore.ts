export const getUserDetails = () => {
    const hasSession = localStorage.getItem('hasSession');

    return hasSession === 'true' ? true : false;
};

export const setUserDetails = (hasSession:boolean) => {
    localStorage.setItem('hasSession', hasSession? 'true': 'false');
};