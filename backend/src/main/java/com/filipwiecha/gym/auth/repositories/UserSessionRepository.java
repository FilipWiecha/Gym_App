package com.filipwiecha.gym.auth.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.filipwiecha.gym.auth.models.UserSession;

public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {
    
    Optional<UserSession> findByRefreshToken(String refreshToken);

    List<UserSession> findByUserIdAndIsRevokedFalseAndExpiresAtAfter(UUID userId, LocalDateTime now);
    
    // Zabezpieczenie, aby użytkownik mógł usunąć tylko swoją sesję
    Optional<UserSession> findByIdAndUserId(UUID id, UUID userId);
}