export interface TotpSetupResponse {
    secret: string;
    qrCodeUri: string;
}

export interface TotpVerifyRequest {
    code: string;
}