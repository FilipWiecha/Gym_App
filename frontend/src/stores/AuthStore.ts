export const getHasSession = () => {
    const hasSession = sessionStorage.getItem('hasSession');

    return hasSession === 'true' ? true : false;
};

export const setHasSession = (hasSession:boolean) => {
    sessionStorage.setItem('hasSession', hasSession? 'true': 'false');
};