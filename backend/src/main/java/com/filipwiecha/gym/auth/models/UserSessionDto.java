package com.filipwiecha.gym.auth.models;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder 
public class UserSessionDto {
    private UUID id;
    private String userAgent;
    private String ipAddress;
    private LocalDateTime lastActiveAt;
    private LocalDateTime createdAt;
    private boolean isCurrentSession;
}
