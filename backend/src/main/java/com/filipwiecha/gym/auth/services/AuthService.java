package com.filipwiecha.gym.auth.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.auth.models.RegisterDto;
import com.filipwiecha.gym.auth.models.UserSession;
import com.filipwiecha.gym.auth.models.UserSessionDto;
import com.filipwiecha.gym.auth.repositories.UserSessionRepository;
import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.user.models.User;
import com.filipwiecha.gym.user.repositories.UserRepository;

@Service 
public class AuthService {
    
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserSessionRepository userSessionRepository;

    public AuthService(UserRepository ur, PasswordEncoder pe, UserSessionRepository usr){
        this.userRepository = ur;
        this.passwordEncoder = pe;
        this.userSessionRepository = usr;
    }


    @Transactional
    public ValidationResult createUser(RegisterDto registerDto){
        List<User> usersToCheck = this.userRepository.findByUsernameOrEmail(registerDto.getUsername(), registerDto.getEmail());

        for (User user : usersToCheck){
            if (user.getUsername().equals(registerDto.getUsername())) {
                return ValidationResult.error("username", "Username is already taken");
            }
            if (user.getEmail().equals(registerDto.getEmail())) {
                return ValidationResult.error("email", "Email is already registered");
            }
        }


        User userToSave = new User(registerDto);
        userToSave.setPassword(this.passwordEncoder.encode(registerDto.getPassword()));
        this.userRepository.save(userToSave);

        return ValidationResult.success();
    }

    @Transactional
    public void createSession(User user, String refreshToken, String userAgent, String ipAddress) {
        UserSession session = new UserSession();
        session.setUser(user);
        session.setRefreshToken(refreshToken);
        session.setUserAgent(userAgent != null ? userAgent : "Unknown");
        session.setIpAddress(ipAddress != null ? ipAddress : "Unknown");
        session.setExpiresAt(LocalDateTime.now().plusDays(1)); // Dopasowane do ważności Refresh Tokenu
        
        userSessionRepository.save(session);
    }

    @Transactional
    public User validateAndRefreshSession(String refreshToken) {
        UserSession session = userSessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (session.isRevoked() || session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session expired or revoked");
        }

        session.setLastActiveAt(LocalDateTime.now());
        userSessionRepository.save(session);

        return session.getUser();
    }

    @Transactional
    public void revokeSession(String refreshToken) {
        userSessionRepository.findByRefreshToken(refreshToken).ifPresent(session -> {
            session.setRevoked(true);
            userSessionRepository.save(session);
        });
    }

    @Transactional(readOnly = true)
    public List<UserSessionDto> getActiveSessionsForUser(String username, String currentRefreshToken) {
        User user = this.getUserByUsername(username);
        return userSessionRepository
            .findByUserIdAndIsRevokedFalseAndExpiresAtAfter(user.getId(), LocalDateTime.now())
            .stream()
            .map(session -> UserSessionDto.builder()
                .id(session.getId())
                .userAgent(session.getUserAgent())
                .ipAddress(session.getIpAddress())
                .lastActiveAt(session.getLastActiveAt())
                .createdAt(session.getCreatedAt())
                .isCurrentSession(session.getRefreshToken().equals(currentRefreshToken))
                .build())
            .toList();
    }

    @Transactional
    public void revokeSessionById(UUID sessionId, String username) {
        User user = this.getUserByUsername(username);
        UserSession session = userSessionRepository.findByIdAndUserId(sessionId, user.getId())
            .orElseThrow(() -> new IllegalArgumentException("Sesja nie istnieje lub brak dostępu"));
        
        session.setRevoked(true);
        userSessionRepository.save(session);
    }

    private User getUserByUsername(String username){
        return this.userRepository.findByUsername(username).orElseThrow(()-> new IllegalArgumentException("User not found!"));
    }

}
