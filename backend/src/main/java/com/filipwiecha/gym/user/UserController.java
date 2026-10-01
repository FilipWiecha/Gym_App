package com.filipwiecha.gym.user;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.user.Models.UserDto;
import com.filipwiecha.gym.user.Models.UserUpdateDto;
import com.filipwiecha.gym.user.Service.UserService;

import jakarta.validation.Valid;

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

    @PatchMapping("/update")
    public ResponseEntity<?> updateUser(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody UserUpdateDto userUpdateDto 
    ){ 
        ValidationResult valid = this.userService.updateUserDetails(jwt.getSubject(), userUpdateDto);
        return valid.response(null, HttpStatus.OK);
    } 

}
