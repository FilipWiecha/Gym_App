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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.auth.models.UserSessionDto;
import com.filipwiecha.gym.auth.services.AuthService;
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

    public UserController(UserService us, AuthService as){
        this.userService = us;
        this.authService = as;
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

}
