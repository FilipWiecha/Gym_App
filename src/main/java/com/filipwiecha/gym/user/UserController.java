package com.filipwiecha.gym.user;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/user") 
public class UserController {
    
    private final UserService userService;

    public UserController(UserService us){
        this.userService = us;
    }

    @GetMapping("")
    public User me(
        @RequestParam("id") UUID userId 
    ){
        
        try {
            return userService.getUser(userId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    } 
}
