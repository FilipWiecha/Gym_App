package com.filipwiecha.gym.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.filipwiecha.gym.user.Models.User;
import com.filipwiecha.gym.user.Service.UserService;

@RestController
@RequestMapping("/user") 
public class UserController {
    
    private final UserService userService;

    public UserController(UserService us){
        this.userService = us;
    }

    @GetMapping("/me")
    public User me(
       @AuthenticationPrincipal Jwt jwt
    ){
        
        try {
            return userService.getUserByUsername(jwt.getSubject());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    } 
}
