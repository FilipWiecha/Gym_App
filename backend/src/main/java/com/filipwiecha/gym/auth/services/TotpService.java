package com.filipwiecha.gym.auth.services;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.util.Utils;
import org.springframework.stereotype.Service;

@Service
public class TotpService {

    private final SecretGenerator secretGenerator;
    private final QrGenerator qrGenerator;
    private final CodeVerifier codeVerifier;

    public TotpService(SecretGenerator secretGenerator, QrGenerator qrGenerator, CodeVerifier codeVerifier) {
        this.secretGenerator = secretGenerator;
        this.qrGenerator = qrGenerator;
        this.codeVerifier = codeVerifier;
    }

    public String generateSecret() {
        return secretGenerator.generate();
    }

    public String getQrCodeImageUri(String secret, String email) throws QrGenerationException {
        QrData data = new QrData.Builder()
                .label(email)
                .secret(secret)
                .issuer("GymApp")
                .algorithm(dev.samstevens.totp.code.HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        byte[] imageData = qrGenerator.generate(data);
        return Utils.getDataUriForImage(imageData, qrGenerator.getImageMimeType());
    }

    public boolean verifyCode(String secret, String code) {
        return codeVerifier.isValidCode(secret, code);
    }
}