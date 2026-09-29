package com.filipwiecha.gym.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.auth.Models.LoginDto;
import com.filipwiecha.gym.auth.Models.RegisterDto;
import com.filipwiecha.gym.auth.Models.TokenDto;


@RestController
@RequestMapping("/auth") 
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthService as, AuthenticationManager am, TokenService ts){
        this.authService = as;
        this.authenticationManager = am;
        this.tokenService = ts;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody LoginDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        String token = tokenService.generateToken(authentication);
        return ResponseEntity.status(HttpStatus.OK).body(new TokenDto(token));
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(
        @RequestBody RegisterDto userDto  
    ){
        this.authService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Created");
    } 
}

