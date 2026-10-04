export default interface LoginDto{
    username:string;
    password:string;
    totpCode?: string;
    rememberMe?: boolean
}