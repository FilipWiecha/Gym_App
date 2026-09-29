package com.filipwiecha.gym.auth;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


import com.filipwiecha.gym.user.UserDto;

@RestController
@RequestMapping("/auth") 
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService as){
        this.authService = as;
    }
    
    @PostMapping("/register")
    public UserDto registerNewUser(
        @RequestBody UserDto userDto  
    ){
        try {
            this.authService.createUser(userDto);

            return userDto;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    } 
}
