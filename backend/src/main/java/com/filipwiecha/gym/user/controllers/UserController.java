package com.filipwiecha.gym.user.controllers;


import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.auth.models.TotpSetupResponse;
import com.filipwiecha.gym.auth.models.TotpVerifyRequest;
import com.filipwiecha.gym.auth.models.UserSessionDto;
import com.filipwiecha.gym.auth.services.AuthService;
import com.filipwiecha.gym.auth.services.TotpService;
import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.user.models.User;
import com.filipwiecha.gym.user.models.UserDto;
import com.filipwiecha.gym.user.models.UserUpdateDto;
import com.filipwiecha.gym.user.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user") 
public class UserController {
    
    private final UserService userService;
    private final AuthService authService;
    private final TotpService totpService;

    public UserController(
        UserService us, 
        AuthService as,
        TotpService ts
    ){
        this.userService = us;
        this.authService = as;
        this.totpService = ts;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(
       @AuthenticationPrincipal Jwt jwt
    ){
        return ResponseEntity.ok(new UserDto(userService.getUserByUsername(jwt.getSubject())));
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateUser(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody UserUpdateDto userUpdateDto 
    ){ 
        ValidationResult valid = this.userService.updateUserDetails(jwt.getSubject(), userUpdateDto);
        return valid.response(null, HttpStatus.OK);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<UserSessionDto>> getSessions(
        @AuthenticationPrincipal Jwt jwt,
        @CookieValue(name = "refresh_token", required = false) String currentRefreshToken
    ) {
        return ResponseEntity.ok(authService.getActiveSessionsForUser(jwt.getSubject(), currentRefreshToken));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> revokeSession(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID sessionId
    ) {
        authService.revokeSessionById(sessionId, jwt.getSubject());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/totp/setup")
    public ResponseEntity<TotpSetupResponse> setupTotp(@AuthenticationPrincipal Jwt jwt) throws Exception {
        User user = userService.getUserByUsername(jwt.getSubject());

        if (user.isTotpEnabled()) {
            throw new IllegalArgumentException("TOTP is already enabled");
        }

        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        this.userService.saveUser(user);

        String qrCodeUri = totpService.getQrCodeImageUri(secret, user.getEmail());
        return ResponseEntity.ok(new TotpSetupResponse(secret, qrCodeUri));
    }

    @PostMapping("/totp/enable")
    public ResponseEntity<Void> enableTotp(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody TotpVerifyRequest request) {
            
        User user = userService.getUserByUsername(jwt.getSubject());

        if (user.isTotpEnabled()) {
            throw new IllegalArgumentException("TOTP is already enabled");
        }

        if (!totpService.verifyCode(user.getTotpSecret(), request.code())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Niewłaściwy kod
        }

        user.setTotpEnabled(true);
        this.userService.saveUser(user);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/totp/disable")
    public ResponseEntity<Void> disableTotp(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody TotpVerifyRequest request) {
            
        User user = userService.getUserByUsername(jwt.getSubject());

        if (!totpService.verifyCode(user.getTotpSecret(), request.code())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        user.setTotpEnabled(false);
        user.setTotpSecret(null);
        this.userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

}
