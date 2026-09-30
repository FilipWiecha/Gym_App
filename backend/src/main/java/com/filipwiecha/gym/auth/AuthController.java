package com.filipwiecha.gym.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.auth.Models.LoginDto;
import com.filipwiecha.gym.auth.Models.RegisterDto;
import com.filipwiecha.gym.auth.Models.TokenDto;
import com.filipwiecha.gym.user.Models.User;
import com.filipwiecha.gym.user.Service.JpaUserDetailsService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/auth") 
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final JwtDecoder jwtDecoder;
    private final JpaUserDetailsService jpaUserDetailsService;

    public AuthController(
        AuthService as, 
        AuthenticationManager am, 
        TokenService ts,
        JwtDecoder jd,
        JpaUserDetailsService juds
    ){
        this.authService = as;
        this.authenticationManager = am;
        this.tokenService = ts;
        this.jwtDecoder = jd;
        this.jpaUserDetailsService = juds;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> loginUser(
        @RequestBody LoginDto request,
        HttpServletResponse response
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        String accessToken = tokenService.generateAccessToken(authentication);
        String refreshToken = tokenService.generateAccessToken(authentication);

        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setMaxAge(60*60*24);
        refreshTokenCookie.setPath("/auth/refresh");
        response.addCookie(refreshTokenCookie);


        return ResponseEntity.status(HttpStatus.OK).body(new TokenDto(accessToken));
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
            Jwt jwt = jwtDecoder.decode(refreshToken);
            String userName = jwt.getSubject();

            User user = this.jpaUserDetailsService.loadUserByUsername(userName);
            Authentication auth = new UsernamePasswordAuthenticationToken(user, null);
            String newAccessToken = this.tokenService.generateAccessToken(auth);

            return ResponseEntity.ok().body(new TokenDto(newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

