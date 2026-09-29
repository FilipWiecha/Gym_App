package com.filipwiecha.gym.user;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.user.Models.UserDto;
import com.filipwiecha.gym.user.Service.UserService;

@RestController
@RequestMapping("/user") 
public class UserController {
    
    private final UserService userService;

    public UserController(UserService us){
        this.userService = us;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(
       @AuthenticationPrincipal Jwt jwt
    ){
        return ResponseEntity.ok(new UserDto(userService.getUserByUsername(jwt.getSubject())));
    }

}
