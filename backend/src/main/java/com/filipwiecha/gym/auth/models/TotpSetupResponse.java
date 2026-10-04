package com.filipwiecha.gym.auth.models;

public record TotpSetupResponse(String secret, String qrCodeUri) {}
