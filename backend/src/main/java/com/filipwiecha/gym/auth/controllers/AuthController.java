package com.filipwiecha.gym.auth.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.auth.models.LoginDto;
import com.filipwiecha.gym.auth.models.RegisterDto;
import com.filipwiecha.gym.auth.models.TokenDto;
import com.filipwiecha.gym.auth.services.AuthService;
import com.filipwiecha.gym.auth.services.TokenService;
import com.filipwiecha.gym.user.models.User;

import jakarta.servlet.http.HttpServletRequest;



@RestController
@RequestMapping("/auth") 
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(
        AuthService as, 
        AuthenticationManager am, 
        TokenService ts
    ){
        this.authService = as;
        this.authenticationManager = am;
        this.tokenService = ts;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> loginUser(
        @RequestBody LoginDto request,
        HttpServletRequest httpRequest
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = (User) authentication.getPrincipal();

        String accessToken = tokenService.generateAccessToken(authentication);
        String refreshToken = tokenService.generateRefreshToken(authentication);

        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ipAddress = httpRequest.getRemoteAddr();

        authService.createSession(user, refreshToken, userAgent, ipAddress);

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(false) // false dla HTTP (localhost)
            .path("/")
            .maxAge(60 * 60 * 24)
            .sameSite("Lax") // Zezwala na przesyłanie ciasteczka przy nawigacji
            .build();


        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(new TokenDto(accessToken, user.getRoles()));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(
        @CookieValue(name = "refresh_token", required = false) String refreshToken
    ){
        if (refreshToken != null) {
            authService.revokeSession(refreshToken);
        }

        ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(
        @RequestBody RegisterDto userDto  
    ){
        this.authService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Created");
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refreshUserAccessToken(
        @CookieValue(name = "refresh_token", required = true) String refreshToken
    ){
        try {
            // Weryfikacja sesji w bazie danych (czy nie wygasła i nie jest zablokowana)
            User user = authService.validateAndRefreshSession(refreshToken);
            
            Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            String newAccessToken = this.tokenService.generateAccessToken(auth);

            return ResponseEntity.ok().body(new TokenDto(newAccessToken, user.getRoles()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

